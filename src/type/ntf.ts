interface nftType {
  nft_id: number;
  uid: number;
  nft_img: any;
  nft_name: string;
  nft_desc: string;
  nft_type: number;
  status: number;
  transfer_type: number;
  basic_bid: number;
  lower_bid: number;
  high_bid: number;
  count: number;
}
export { nftType };
