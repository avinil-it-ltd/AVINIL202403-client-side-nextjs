module.exports = function (source) {
  if (typeof source === 'string' && source.includes('export default')) {
    return source.replace(
      /export default\s+(\{[\s\S]*?\});?/,
      'const img = $1; img.toString = function() { return this.src; }; export default img;'
    );
  }
  return source;
};
