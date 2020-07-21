export const cardTypes = ["PureTextCard", "ImageCard"] as const;

export type cardType = typeof cardTypes[number];

export interface PureTextCardInterface {
  id: string;
  type: cardType;
  text: string;
}

export type genralCardTpye = PureTextCardInterface;
