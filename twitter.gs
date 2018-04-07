// 最初にこの関数を実行し、ログに出力されたURLにアクセスしてOAuth認証する
function twitterAuthorizeUrl() {
  Twitter.oauth.showUrl();
}

// OAuth認証成功後のコールバック関数
function twitterAuthorizeCallback(request){
  return Twitter.oauth.callback(request);
}

// OAuth認証のキャッシュをを削除する場合はこれを実行（実行後は再度認証が必要）
function twitterAuthorizeClear(){
  Twitter.oauth.clear();
}

var Twitter = {
  consumerKey: "<CONSUMERKEYS>",
  consumerSecret: "<CONSUMERSECRET>",
  
  apiUrl: "https://api.twitter.com/1.1/",
  
  oauth: {
    name: "twitter",
    
    service: function(){
      return OAuth1.createService(this.name)
      
      // Set the endpoint URLs.
      .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
      .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
      .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
      
      // Set the consumer key and secret.
      .setConsumerKey(this.parent.consumerKey)
      .setConsumerSecret(this.parent.consumerSecret)      
      
      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('twitterAuthorizeCallback')
      
      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties());
    },
    
    showUrl: function(request){
      var service = this.service();
      if(!service.hasAccess()){
        Logger.log(service.authorize());
      }
      else{
        Logger.log("認証済みです");
      }
    },
    
    callback: function(request){
      var service = this.service();
      var isAuthorized = service.handleCallback(request);
      if(isAuthorized){
        return HtmlService.createHtmlOutput("認証に成功しました!このタブは閉じて構いません.");
      }
      else{
        return HtmlService.createHtmlOutput("認証に失敗しました...");
      }
    },
    
    clear: function(){
      OAuth1.createService(this.name)
      .setPropertyStore(PropertiesService.getUserProperties())
      .reset();
    },
    
  },

  tweet: function(content){
    var service = this.oauth.service();
    if(service.hasAccess()){
      var url = this.apiUrl + "statuses/update.json";
      var payload = {
        status: content
      };
      var response = service.fetch(url, {
        method: 'post',
        payload: payload
      });
      var result = JSON.parse(response.getContentText());
      Logger.log(JSON.stringify(result, null, 2));
    }
    else{
      var authorizationUrl = service.authorize();
      Logger.log('次のURLを開いて、スクリプトを再実行してください: %s', authorizationUrl);
    } 
  },
  
  init: function(){
    this.oauth.parent = this;
    return this;
  }
}.init();

