export const cardTypes = ["PureTextCard", "ImageCard"] as const;

export type cardType = typeof cardTypes[number];

interface CardInterface {
  style: {
    width: number;
    height: number;
  };
}

export interface PureTextCardInterface extends CardInterface {
  id: string;
  type: cardType;
  text: string;
}

export interface ImageCardInterface extends CardInterface {
  id: string;
  type: cardType;
  img: string;
}

export type genralCardTpye = PureTextCardInterface | ImageCardInterface;
