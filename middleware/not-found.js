const notFound = (req, res) => {
  res.status(404).send('page is not found')
}

module.exports = notFound