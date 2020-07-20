export const cardTypes = ["PureTextCard", "ImageCard"] as const;

export type cardType = typeof cardTypes[number];

export interface Card {
  id: string;
  type: cardType;
  text: string;
}
