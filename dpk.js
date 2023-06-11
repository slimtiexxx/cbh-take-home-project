const { generateHash } = require("./utils");
const { DEFAULT_PARTITION_KEY, MAX_PARTITION_KEY_LENGTH } = require("./constants");

const defaultEvent = {
  partitionKey: DEFAULT_PARTITION_KEY,
}

exports.deterministicPartitionKey = (event = defaultEvent) => {
  let candidate = event.partitionKey ?? generateHash(JSON.stringify(event));

  candidate = typeof candidate === "string" ? candidate : JSON.stringify(candidate);

  candidate = candidate.length > MAX_PARTITION_KEY_LENGTH ? generateHash(candidate) : candidate;

  return candidate;
};