function GetVAName() {
  // 現在日時を取得
  var date = new Date();
  
  // スプレッドシートを取得
  var file = SpreadsheetApp.getActiveSpreadsheet();
 
  // 現在の月のシートを取得
  var sheet = file.getSheets()[date.getMonth()];
  
  // 現在の日付の行を取得
  var names = [];
  var index = 0;
  var range = sheet.getRange("A" + date.getDate());
  while(true){
    var cell = range.offset(0, index).getValue();
    if(cell == ""){
      break;
    }
    names[index] = cell;
    index++;
  }
  
  Logger.log(names);
  TweetHappyBirthday(names);
}

function TweetHappyBirthday(names) {
  if(names.length <= 0){
    return;
  }
  
  names.forEach(function(value){
    Twitter.tweet(value + "さん\nお誕生日おめでとうございます！！！");
    Utilities.sleep(10000);
  });
}
  