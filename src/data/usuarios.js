const usuarios = [];
let nextId = 1;

function gerarId() {
	return nextId++;
}

module.exports = { usuarios, gerarId };