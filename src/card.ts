/* eslint-disable @typescript-eslint/camelcase */
export const cardTypes = ["PureTextCard", "ImageCard", "CodeCard"] as const;

export type cardType = typeof cardTypes[number];

// 紀錄卡片關聯
const relationMappingObj = {
  properties: {
    relation_name: {
      type: "keyword"
    },
    related_card: {
      type: "keyword"
    }
  }
};

export const PureTextCardSettings = {
  settings: {
    analysis: {
      analyzer: {
        my_hanlp_analyzer: {
          tokenizer: "my_hanlp"
        }
      },
      tokenizer: {
        my_hanlp: {
          type: "hanlp",
          enable_stop_dictionary: true,
          enable_custom_config: true
        }
      }
    }
  },
  mappings: {
    properties: {
      id: {
        type: "keyword"
      },
      type: {
        type: "keyword"
      },
      text: {
        type: "text",
        analyzer: "my_hanlp_analyzer"
      },
      style: {
        properties: {
          width: {
            type: "integer"
          },
          height: {
            type: "integer"
          }
        }
      },
      card_relation_sets: relationMappingObj
    }
  }
};

export const ImageCardSettings = {
  settings: {
    analysis: {
      analyzer: {
        my_hanlp_analyzer: {
          tokenizer: "my_hanlp"
        }
      },
      tokenizer: {
        my_hanlp: {
          type: "hanlp",
          enable_stop_dictionary: true,
          enable_custom_config: true
        }
      }
    }
  },
  mappings: {
    properties: {
      id: {
        type: "keyword"
      },
      type: {
        type: "keyword"
      },
      description: {
        type: "text",
        analyzer: "my_hanlp_analyzer"
      },
      img: {
        type: "binary"
      },
      style: {
        properties: {
          width: {
            type: "integer"
          },
          height: {
            type: "integer"
          }
        }
      },
      card_relation_sets: relationMappingObj
    }
  }
};

export const CodeCardSettings = {
  settings: {
    analysis: {
      analyzer: {
        my_hanlp_analyzer: {
          tokenizer: "my_hanlp"
        }
      },
      tokenizer: {
        my_hanlp: {
          type: "hanlp",
          enable_stop_dictionary: true,
          enable_custom_config: true
        }
      }
    }
  },
  mappings: {
    properties: {
      id: {
        type: "keyword"
      },
      type: {
        type: "keyword" // exact match
      },
      code: {
        type: "text",
        index: false // not quearyable
      },
      description: {
        type: "text", // index ~ full-text-search
        analyzer: "my_hanlp_analyzer"
      },
      style: {
        properties: {
          width: {
            type: "integer"
          },
          height: {
            type: "integer"
          }
        }
      },
      card_relation_sets: relationMappingObj
    }
  }
};

export const cardRelationMapping = {
  mappings: {
    properties: {
      id: {
        type: "keyword"
      },
      name: {
        type: "keyword"
      }
    }
  }
};

interface CardInterface {
  id: string;
  type: cardType;
  style: {
    width: number;
    height: number;
  };
  card_relation_sets: {
    relation_name: string;
    related_card: string[];
  }[];
}
export interface CodeCardInterface extends CardInterface {
  code: string;
  description: string;
}

export interface PureTextCardInterface extends CardInterface {
  text: string;
}

export interface ImageCardInterface extends CardInterface {
  img: string;
  description: string;
}

export type genralCardInterface =
  | PureTextCardInterface
  | ImageCardInterface
  | CodeCardInterface;
