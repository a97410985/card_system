/* eslint-disable @typescript-eslint/camelcase */
export const cardTypes = ["PureTextCard", "ImageCard", "CodeCard"] as const;

export type cardType = typeof cardTypes[number];

export const PureTextCardSettings = {
  settings: {
    analysis: {
      analyzer: {
        my_hanlp_analyzer: {
          tokenizer: "my_hanlp",
        },
      },
      tokenizer: {
        my_hanlp: {
          type: "hanlp",
          enable_stop_dictionary: true,
          enable_custom_config: true,
        },
      },
    },
  },
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
        properties: {
          width: {
            type: "integer",
          },
          height: {
            type: "integer",
          },
        },
      },
    },
  },
};

export const ImageCardSettings = {
  settings: {
    analysis: {
      analyzer: {
        my_hanlp_analyzer: {
          tokenizer: "my_hanlp",
        },
      },
      tokenizer: {
        my_hanlp: {
          type: "hanlp",
          enable_stop_dictionary: true,
          enable_custom_config: true,
        },
      },
    },
  },
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
        properties: {
          width: {
            type: "integer",
          },
          height: {
            type: "integer",
          },
        },
      },
    },
  },
};

interface CardInterface {
  id: string;
  type: cardType;
  style: {
    width: number;
    height: number;
  };
}
export interface CodeCardInterface extends CardInterface {
  code: string;
}

export interface PureTextCardInterface extends CardInterface {
  text: string;
}

export interface ImageCardInterface extends CardInterface {
  img: string;
}

export type genralCardTpye = PureTextCardInterface | ImageCardInterface;
