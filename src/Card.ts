// 定義有哪些種類的卡片
export const cardTypes = ["PureTextCard", "ImageCard", "CodeCard"] as const;

export type cardType = typeof cardTypes[number];

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

const generalCardSetting = {
  analysis: {
    analyzer: {
      myHanlpAnalyzer: {
        tokenizer: "myHanlp"
      }
    },
    tokenizer: {
      myHanlp: {
        type: "hanlp",
        // eslint-disable-next-line @typescript-eslint/camelcase
        enable_stop_dictionary: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        enable_custom_config: true
      }
    }
  }
};

const generalCardMappingProperty = {
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

export interface CardSettingInterface {
  settings: any;
  mappings: any;
}

// 卡片的設置，使用時機~elasticSearch要建index的時候
export const PureTextCardSettings = {
  settings: generalCardSetting,
  mappings: {
    properties: {
      text: {
        type: "text",
        analyzer: "myHanlpAnalyzer"
      },
      ...generalCardMappingProperty
    }
  }
};

export const ImageCardSettings = {
  settings: generalCardSetting,
  mappings: {
    properties: {
      description: {
        type: "text",
        analyzer: "myHanlpAnalyzer"
      },
      img: {
        type: "binary"
      },
      ...generalCardMappingProperty
    }
  }
};

export const CodeCardSettings = {
  settings: generalCardSetting,
  mappings: {
    properties: {
      code: {
        type: "text",
        index: false // 不要索引，不需要搜尋的時候能被搜尋到
      },
      description: {
        type: "text",
        analyzer: "myHanlpAnalyzer"
      },
      ...generalCardMappingProperty
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
