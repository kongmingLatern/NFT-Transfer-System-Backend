import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { ToolsService } from '@/common/utils/tools.service';
import { nftType } from '@/type/ntf';
import { imgAddress, MergeArrays } from '@/common/config/merge';
import { timestampToTime } from '@/common/config/timesTamp';
import { v4 as uuid4v } from 'uuid';
@Injectable()
export class NftService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}
  async getDetail(nft_id) {
    //查询nft
    const sql1 = `select nft_id,uid,nft_name,nft_desc,nft_type,transfer_type,
    basic_bid,lower_bid,high_bid,finish_date,count
    from nfts where nft_id='${nft_id}'`;
    const sql2 = `SELECT username as buyer
    FROM auction_table,users
    WHERE  auction_table.uid=users.uid 
    AND price= (SELECT MAX(price) FROM auction_table WHERE nft_id='${nft_id}')
    LIMIT 1;`;
    const result1 = await this.repository.query(sql1);
    const result2 = await this.repository.query(sql2);
    const nft_data = MergeArrays(result1, result2);

    //生成折线图
    let sqlstr = `select pay_date,count(*) 
    from auction_table where nft_id=${nft_id} 
    GROUP BY pay_date order by pay_date ASC`;
    const chart_data = await this.repository.query(sqlstr);

    //查询返回字段，卖家，nft名称，卖家，交易价格
    sqlstr = `select users.username from orders,users
    WHERE orders.nft_id=${nft_id} and orders.seller_id=users.uid`;
    const userdata = await this.repository.query(sqlstr);
    const sqlstrseller = `SELECT nfts.nft_name,orders.transaction_price,users.username
    FROM orders,nfts,users
    WHERE  orders.nft_id=${nft_id} and orders.nft_id=nfts.nft_id and orders.buyer_id=users.uid`;
    const mes = await this.repository.query(sqlstrseller);
    const newdata = [];
    for (let i = 0; i < userdata.length; i++) {
      newdata.push({ ...userdata[i], ...mes[i] });
    }
    return {
      nft_data: nft_data[0],
      chart_data: chart_data,
      Transactions: newdata,
    };
  }
  //将nft加入购物车
  async addCart({ uid, nft_id }) {
    //查询购物车是否重复的
    let sqlstr = `SELECT uid,nft_id from shopping_cart WHERE uid=${uid} and nft_id=${nft_id} `;
    let result = await this.repository.query(sqlstr);
    if (result.length > 0) ToolsService.fail('该物品已添加购物车！');

    //加入购物中
    sqlstr = `insert into shopping_cart (cart_id,uid,nft_id) values('${uuid4v()}','${uid}','${nft_id}')`;
    console.log(sqlstr);
    result = await this.repository.query(sqlstr);
    if (typeof result === 'object') return '添加成功！';
    else ToolsService.fail('添加失败！');
  }
  /**
   *参加拍卖会
   */
  async addAuction({ uid, nft_id, price }) {
    //退钱
    //更新之前，获取当前最高出价人信息
    const sqluid = `SELECT uid, price 
    FROM auction_table 
    WHERE nft_id = ${nft_id} 
    ORDER BY price DESC 
    LIMIT 1`;
    const max = await this.repository.query(sqluid);
    if (max[0].uid === uid) return ToolsService.fail('您已参与过该拍卖');
    const sql1 = `select owner from nfts where nft_id=${nft_id}`;
    const sqlff = await this.repository.query(sql1);
    if (sqlff[0].owner) return ToolsService.fail('您是卖家不能参加拍卖会！');

    //更新之前获取当前出价最高者的余额
    const sqluidremining = `select remining from users where nft_id=${max[0].uid}`;
    let remining = await this.repository.query(sqluidremining);
    remining = remining + max[0].price;

    //退钱
    let Refundsql = `updata users set remining=${remining} where uid=${max[0].uid}`;
    this.repository.query(Refundsql);

    //更新当前最高出者
    //扣钱，查询出参与拍卖的余额
    const sql = `select remining from users where nft_id=${uid}`;
    remining = (await this.repository.query(sql)) - price;
    if (remining < 0) ToolsService.fail('您的余额不足！');

    Refundsql = `updata users set remining=${remining} where uid=${uid}`;
    this.repository.query(Refundsql);

    //插入拍卖表
    const sqlstr = `insert into auction_table (uid,nft_id,price,pay_date) values(${uid},${nft_id},${price},CURDATE())`;
    await this.repository.query(sqlstr);
    // if()
    //   const sql1= `UPDATE nfts SET finish_date = DATE_ADD(finish_date, interval 2 minute) WHERE nft_id=${nft_id}`;

    return '参与成功！';
  }
  //生成订单
  /**
   * @param arrObj {uid:
   * data:[
   * ntf_id,
   * count
   * ],
   * price,
   */
  async nftOrder(dataObj) {
    const { uid, data, price } = dataObj;
    //updata更新users
    const sqlstr = `select remaining from users where uid=${uid}`;
    const remining = await this.repository.query(sqlstr);
    if (remining - price < 0) ToolsService.fail('您的余额不足！');
    //扣钱
    const updata = `updata users set remaining=${remining - price}`;
    this.repository.query(updata);

    //生成订单
    data.map(async (item) => {
      const sql = `SELECT basic_bid,high_bid,transfer_type,lower_bid from nfts WHERE nft_id=${item.nft_id}`;
      const obj = await this.repository.query(sql);
      if (
        obj[0].high_bid <= obj[0].lower_bid * item.count ||
        obj[0].transfer_type === 0
      ) {
        const sqlown = `select owner from nfts where nft_id=${item.ntf_id}`;
        const owner = await this.repository.query(sqlown);
        const sqlupdata = `updata nfts set owner=${uid} where nft_id=${item.ntf_id}`;
        await this.repository.query(sqlupdata);

        const sqlin = `INSERT INTO orders 
        (nft_id,seller_id,buyer_id,transaction_price,transaction_date)
         values(${data[0].ntf_id},${owner},${uid},${obj.basic_bid},CURDATE())`;
        await this.repository.query(sqlin);
      } else {
        const obj1 = {
          uid: uid,
          nft_id: item.nft_id,
          price: obj[0].lower_bid * item.countm,
        };
        this.addAuction(obj1);
      }
    });
    return '购买成功！';
  }

  //点击购物车
  async getCart(uid: number) {
    const sqlstr = `SELECT nfts.nft_id,nfts.nft_img,nfts.nft_name,nfts.nft_desc,nfts.nft_type,
    nfts.status,nfts.basic_bid,nfts.lower_bid,nfts.high_bid,nfts.count,
		nfts.owner as owner_id,users.username as owner_name
        FROM nfts,type_nft,users
        WHERE nfts.nft_type=type_nft.id and users.uid=nfts.owner AND nft_id in 
        (select nft_id from shopping_cart where uid=${uid});`;
    const result: Array<nftType> = await this.repository.query(sqlstr);
    result.forEach((item) => {
      if (item.high_bid === 0 && item.lower_bid === 0) {
        return item;
      }
      item.count = Math.ceil((item.high_bid - item.basic_bid) / item.lower_bid);
      item.basic_bid += item.lower_bid;
      return item;
    });
    return result;
  }

  async deleteCart({ uid, nft_id }) {
    const sqlstr = `delete from shopping_cart where nft_id='${nft_id}' and uid='${uid}'`;
    const result = await this.repository.query(sqlstr);
    if (result.protocol41) return '删除成功！！';
    ToolsService.fail('删除失败！！');
  }
  //上传nft
  async uploadNft(img, upload) {
    const time = timestampToTime(1660208851);
    console.log(time); // 2022-08-11 17:07:31

    // const sqlstr = `select id from type_nft where type=${upload.nft_type}`;
    // const type = await this.repository.query(sqlstr);
    // upload.nft_type = type[0].id;
    upload.avatar = imgAddress(img);
    let str = '';
    Object.keys(upload).map((item) => {
      if (item !== 'nft_id') str += "'" + upload[item] + "',";
    });
    str = str.slice(0, -1);
    const sqlstr1 = `insert into user values(${str})`;
    console.log(sqlstr1);
    // const data = await this.repository.query(sqlstr);
    // return data;
  }
}
