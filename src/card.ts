export const cardTypes = ["PureTextCard", "ImageCard", "CodeCard"] as const;
export type cardType = typeof cardTypes[number];
// 紀錄卡片關聯
const relationMappingObj = {
  properties: {
    relationName: {
      type: "keyword"
    },
    relatedCard: {
      type: "keyword"
    }
  }
};

const generalCardSettings = {
  analysis: {
    analyzer: {
      myHanlpAnalyzer: {
        tokenizer: "myHanlp"
      }
    },
    tokenizer: {
      myHanlp: {
        type: "hanlp",
        enableStopDictionary: true,
        enableCustomConfig: true
      }
    }
  }
};

const generalCardMappingProperties = {
  id: {
    type: "keyword"
  },
  type: {
    type: "keyword"
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
  cardRelationSets: relationMappingObj
};

// 時機 : 在elasticSearch建index的時候會用到
export const PureTextCardSettings = {
  settings: generalCardSettings,
  mappings: {
    properties: {
      text: {
        type: "text",
        analyzer: "myHanlpAnalyzer"
      },
      ...generalCardMappingProperties
    }
  }
};

export const ImageCardSettings = {
  settings: generalCardSettings,
  mappings: {
    properties: {
      description: {
        type: "text",
        analyzer: "my_hanlp_analyzer"
      },
      img: {
        type: "binary"
      },
      ...generalCardMappingProperties
    }
  }
};

export const CodeCardSettings = {
  settings: generalCardSettings,
  mappings: {
    properties: {
      code: {
        type: "text",
        index: false // not quearyable
      },
      description: {
        type: "text", // index ~ full-text-search
        analyzer: "my_hanlp_analyzer"
      },
      ...generalCardMappingProperties
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
interface GeneralCardInterface {
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

export interface CodeCardInterface extends GeneralCardInterface {
  code: string;
  description: string;
}

export interface PureTextCardInterface extends GeneralCardInterface {
  text: string;
}

export interface ImageCardInterface extends GeneralCardInterface {
  img: string;
  description: string;
}

export type genralCardInterface =
  | PureTextCardInterface
  | ImageCardInterface
  | CodeCardInterface;
