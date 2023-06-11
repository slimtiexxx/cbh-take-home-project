const { deterministicPartitionKey } = require("./dpk");
const { DEFAULT_PARTITION_KEY, MAX_PARTITION_KEY_LENGTH } = require("./constants");
const GENERATED_HASH = 'generated-hash-1234'

jest.mock('./utils',  () => ({
  ...jest.requireActual('./utils'),
  generateHash: jest.fn(() => GENERATED_HASH)
}));

describe("deterministicPartitionKey", () => {
  it("Returns the given participation key when it's passed as input", () => {
    const trivialKey = deterministicPartitionKey({ partitionKey: 'asdasd123123' });
    expect(trivialKey).toStrictEqual("asdasd123123");
  });

  it("Returns the participation key as string", () => {
    const trivialKey = deterministicPartitionKey({ partitionKey: 123 });
    expect(trivialKey).toStrictEqual("123");
  });

  it("Returns the default partition key when given no input", () => {
    const key = deterministicPartitionKey();
    expect(key).toStrictEqual(DEFAULT_PARTITION_KEY);
  });

  describe('Returns hash when', () => {
    it('Participation key is not available', () => {
      expect(deterministicPartitionKey({ unknownKey: '123' })).toStrictEqual(GENERATED_HASH)
      expect(deterministicPartitionKey({})).toStrictEqual(GENERATED_HASH)
    });

    it('Participation key is longer or equal than maximum allowed length', () => {
      const key = deterministicPartitionKey({ partitionKey: new Array(MAX_PARTITION_KEY_LENGTH + 2).join('#') });
      expect(key).toStrictEqual(GENERATED_HASH)
    });
  });
});
