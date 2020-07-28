/* eslint-disable @typescript-eslint/camelcase */
export const cardTypes = ["PureTextCard", "ImageCard"] as const;

export type cardType = typeof cardTypes[number];

interface CardInterface {
  style: {
    width: number;
    height: number;
  };
}

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

export interface CodeCardInterface extends CardInterface {
  id: string;
  type: cardType;
  code: string;
  style: {
    width: number;
    height: number;
  };
}

export interface PureTextCardInterface extends CardInterface {
  id: string;
  type: cardType;
  text: string;
  style: {
    width: number;
    height: number;
  };
}

export interface ImageCardInterface extends CardInterface {
  id: string;
  type: cardType;
  img: string;
  style: {
    width: number;
    height: number;
  };
}

export type genralCardTpye = PureTextCardInterface | ImageCardInterface;
