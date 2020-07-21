export const cardTypes = ["PureTextCard", "ImageCard"] as const;

export type cardType = typeof cardTypes[number];

export interface PureTextCardInterface {
  id: string;
  type: cardType;
  text: string;
}

export interface ImageCardInterface {
  id: string;
  type: cardType;
  img: string;
}

export type genralCardTpye = PureTextCardInterface | ImageCardInterface;
