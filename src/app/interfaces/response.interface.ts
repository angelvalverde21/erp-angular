export interface Resp<> {
  status : number;  
  success : boolean,
  message : string,
  error : string | [],
  data: any;
}