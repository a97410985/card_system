import {
  getAllCard,
  checkAndInitializePureTextCardPromsie,
  checkAndCreateCardIndexPromise,
  checkCardIndexPromise,
  createSnapShotRepository,
  readSnapShotRepository,
  deleteSnapShotRepository,
  createSanpshot,
  deleteAllIndex,
  restoreBySnapshot,
  getAllIndex,
  deleteSnapshot
} from "../../src/elasticSearchHelper";
import { PureTextCardSettings, CodeCardSettings } from "@/Card";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

describe("測試跟elasticSearch相關的操作", () => {
  test("1 + 2 = 3", () => {
    expect(1 + 2).toBe(3);
  });

  describe("測試snapshot CRUD功能", () => {
    test("跑一次建立repository的流程", async () => {
      const repositoryName = "aaaabbbbcccc";
      const success = await createSnapShotRepository(repositoryName);
      expect(success).toBeTruthy();

      const data = await readSnapShotRepository(repositoryName);
      expect(data[repositoryName]).toHaveProperty("settings");
      expect(data[repositoryName]).toHaveProperty("type");

      const deleteSuccess = await deleteSnapShotRepository(repositoryName);
      expect(deleteSuccess).toBeTruthy();
      const emptyData = await readSnapShotRepository(repositoryName);
      expect(emptyData).toBeNull();
    });

    test("測試建立snapshot", async () => {
      const repositoryName = "test";

      const data = await readSnapShotRepository(repositoryName);
      if (!data) {
        const createSuccess = await createSnapShotRepository(repositoryName);
        expect(createSuccess).toBeTruthy();
      }

      const snapshotName = uuidv4();
      const createSanpshotSuccess = await createSanpshot(
        repositoryName,
        snapshotName
      );
      expect(createSanpshotSuccess).toBeTruthy();
    });

    test("測試先建snapshot repository，修改elasticSearch的資料後，再還原", async () => {
      const success = await checkAndCreateCardIndexPromise(
        "PureTextCard",
        CodeCardSettings,
        false
      );
      expect(success).toBeTruthy();

      const repositoryName = "test";
      const data = await readSnapShotRepository(repositoryName);
      if (data === null) {
        const createSuccess = await createSnapShotRepository(repositoryName);
        expect(createSuccess).toBeTruthy();
      }

      const snapshotName = uuidv4();
      const createSanpshotSuccess = await createSanpshot(
        repositoryName,
        snapshotName
      );
      expect(createSanpshotSuccess).toBeTruthy();

      const deleteAllSuccess = await deleteAllIndex();
      expect(deleteAllSuccess).toBeTruthy();
      const allIndex = await getAllIndex();
      expect(allIndex).toEqual({});

      const restoreSuccess = await restoreBySnapshot(
        repositoryName,
        snapshotName
      );
      expect(restoreSuccess).toBeTruthy();

      const restoredAllIndex = await getAllIndex();
      expect(restoredAllIndex).toHaveProperty("puretextcard");
    });
  });

  describe("建立所有卡片的index", () => {
    test("得到所有卡片", async () => {
      const data = await getAllCard;
      console.log(data);
    });

    test("建立pureTextCard的index", async () => {
      const data = await checkAndCreateCardIndexPromise(
        "PureTextCard",
        CodeCardSettings,
        false
      );
      expect(data).toBeTruthy(); // 確認建好index
      const exists = await checkCardIndexPromise("PureTextCard", false);
      expect(exists).toBeTruthy(); // 確定有那個index
    });

    test("建立ImageCard的index", async () => {
      const data = await checkAndCreateCardIndexPromise(
        "ImageCard",
        CodeCardSettings,
        false
      );
      expect(data).toBeTruthy(); // 確認建好index
      const exists = await checkCardIndexPromise("ImageCard", false);
      expect(exists).toBeTruthy(); // 確定有那個index
    });

    test("建立CodeCard的index", async () => {
      const data = await checkAndCreateCardIndexPromise(
        "CodeCard",
        CodeCardSettings,
        false
      );
      expect(data).toBeTruthy(); // 確認建好index
      const exists = await checkCardIndexPromise("CodeCard", false);
      expect(exists).toBeTruthy(); // 確定有那個index
    });
  });
});
