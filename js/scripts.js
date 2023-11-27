function converterDataFormato(data) {
    const partesData = data.split('/');
    const dataFormatoISO = new Date(partesData[2], partesData[1] - 1, partesData[0]);
    const dataIso = dataFormatoISO.toISOString().split('T')[0];

    return dataIso;
}

function validaDatas(dataInicial, dataFinal) {

    const dataMinima = new Date('2000-01-01');
    const dataMaxima = new Date('2099-01-01');

    dataInicial = converterParaDataFormatoIso(dataInicial);
    dataFinal = converterParaDataFormatoIso(dataFinal);

    return (dataInicial >= dataMinima && dataFinal <= dataMaxima && dataInicial <= dataFinal);
}

function converterParaDataFormatoIso(data) {
    const partesData = data.split('/');
    return new Date(partesData[2], partesData[1] - 1, partesData[0]);
}