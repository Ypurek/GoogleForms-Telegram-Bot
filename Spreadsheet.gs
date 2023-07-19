class SheetHandler {
  constructor(sheetId) {
    this.sheetId = sheetId;
    this.spreadsheet = SpreadsheetApp.openById(sheetId);
    this.answersSheet = this.spreadsheet.getSheets()[0];
    this.subscribersSheet = this.createSheetIfNotExists("Subscribers");
    this.pointerSheet = this.createSheetIfNotExists("Pointer");
    if (this.getPointer() == '') {
      this.pointerSheet.getRange(1, 1).setValue(1);
    }
    
  }

  createSheetIfNotExists(sheetName) {
    let existingSheet = this.spreadsheet.getSheetByName(sheetName);
    if (!existingSheet) {
      this.spreadsheet.insertSheet(sheetName);
    }
    return this.spreadsheet.getSheetByName(sheetName);
  }

  searchChatId(chatId) {
    let dataRange = this.subscribersSheet.getDataRange();
    let values = dataRange.getValues();

    for (let i = 0; i < values.length; i++) {
      if (values[i][0] === name) {
        return i;
      }
    }
    return -1;
  }

  removeChatId(chatId) {
    let dataRange = this.subscribersSheet.getDataRange();
    let values = dataRange.getValues();
    let updatedValues = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] != chatId) {
        updatedValues.push(values[i]);
      }
    }
    this.subscribersSheet.clearContents();
    if (updatedValues.length > 0)
      this.subscribersSheet.getRange(1, 1, updatedValues.length, updatedValues[0].length).setValues(updatedValues);
  }

  addChatId(chatId) {
    let lastRow = this.subscribersSheet.getLastRow();
    let newRow = lastRow + 1;
    this.subscribersSheet.getRange(newRow, 1).setValue(chatId);
  }

  listChatIds() {
    let dataRange = this.subscribersSheet.getDataRange();
    let values = dataRange.getValues();
    let result = []
    for (let i = 0; i < values.length; i++) {
      result.push(values[i][0]);
    }
    return result;
  }

  getPointer() {
    let dataRange = this.pointerSheet.getDataRange();
    let values = dataRange.getValues();
    return values[0][0];
  }

  setPointer(value) {
    Logger.log('pointer value = ' + value);
    this.pointerSheet.getRange(1, 1).setValue(value);
  }

  listLatestAnswers() {
    let dataRange = this.answersSheet.getDataRange();
    let values = dataRange.getValues();
    let startFrom = this.getPointer();
    let results = [];
    for (let i = startFrom; i < values.length; i++) {
      let row = '';
      for (let j = 0; j < values[i].length; j++) {
        row += values[i][j] + ' _ ';
      }
      results.push(row);
    }
    this.setPointer(values.length);
    return results;
  }

}


