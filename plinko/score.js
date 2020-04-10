const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  // Write code here to analyze stuff
  const testDataCount = 20;
  const [testSet, trainingSet] = splitDataset(outputs, testDataCount);
  _.range(1, 10).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
      .size()
      .divide(testDataCount)
      .value();
    console.log("K:", k, " accuracy:", accuracy);
  });
}

function knn(data, point, k) {
  return _.chain(data)
    .map(row => {
      return [distance(_.initial(row), point), _.last(row)];
    })
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(({ a, b }) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
}

function splitDataset(data, testCount) {
  const shuffledData = _.shuffle(data);
  const testSet = _.slice(shuffledData, 0, testCount);
  const trainingSet = _.slice(shuffledData, testCount);
  return [testSet, trainingSet];
}
