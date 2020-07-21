export const cardTypes = ["PureTextCard", "ImageCard"] as const;

export type cardType = typeof cardTypes[number];

interface CardInterface {
  style: {
    width: number;
    height: number;
  };
}

export const PureTextCardMappings = {
  mappings: {
    properties: {
      id: {
        type: "keyword",
      },
      type: {
        type: "keyword",
      },
      text: {
        type: "text",
      },
      style: {
        width: {
          type: "integer",
        },
        height: {
          type: "integer",
        },
      },
    },
  },
};

export const ImageCardMappings = {
  mappings: {
    properties: {
      id: {
        type: "keyword",
      },
      type: {
        type: "keyword",
      },
      img: {
        type: "binary",
      },
      style: {
        width: {
          type: "integer",
        },
        height: {
          type: "integer",
        },
      },
    },
  },
};

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
