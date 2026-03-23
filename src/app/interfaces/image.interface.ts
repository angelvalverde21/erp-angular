export interface Image {
  id: number;               // bigint en MySQL → number en TS
  url_thumbnail: string;   // tinyint con valores específicos
  url_medium: string;   // tinyint con valores específicos
  url_large: string;   // tinyint con valores específicos
}