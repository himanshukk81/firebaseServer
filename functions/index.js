// var functions = require('firebase-functions');
var serviceAccount = require("./service.json");
// var admin = require("firebase-admin");
// admin.initializeApp(functions.config().firebase);
// exports.helloWorld=functions.https.onRequest((request,response)=>{
// 	response.send("new hellllooo");
// })
 //this is the service account details generated from server
// exports.helloWorld=functions.https.onRequest((request,response)=>{
// 	response.send("new hellllooo");
// })
const functions = require('firebase-functions');
const admin = require("firebase-admin");
// var first=false;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:"https://autorepair-1510293342488.firebaseio.com/"
});

// exports.sanitizePost =functions.database.ref('/user_detail/{userId}').onWrite(event =>{
// 	console.log("Event trigger288888888");
// 	const payload = {
// 	        notification: {
// 	          title:"Hellooo",
// 	          icon: "https://placeimg.com/250/250/people",
// 	          click_action: "https://autorepair-1510293342488.firebaseapp.com"
// 	        }
// 	      };
// 	    admin.database()
// 	        .ref(`/fcmTokens/iihO8BM5gjavSSRHsRGupGaHUbu2`)
// 	        .once('value')
// 	        .then(token => token.val())
// 	        .then(userFcmToken => {
// 	          console.log("User tokens38 line===="+userFcmToken);
// 	          	console.log("New Notification");
// 	            admin.messaging().sendToDevice(userFcmToken, payload)
// 	            // first=true;
// 	        })
// 	        .then(res => {
// 	          console.log("Sent Successfully", res);
// 	        })
// 	        .catch(err => {
// 	          console.log("Error sent222222222=====",err);
// 	    });
// })

exports.helloWorld=functions.https.onRequest((request,response)=>{
	response.send("Hello from firebase213123123123123213123123123123213");
})
exports.fcmSendUser = functions.database.ref('/user_detail/{userId}').onCreate(event => {
	console.log("This is working now thankssssssss");
	const message = event.data.val();
	const userId  = event.params.userId;
	const messageId =event.params.messageId;
	console.log("sending ghjgjhjhjh--------------------------------"+userId);
	console.log("message info==="+JSON.stringify(event.data));
	console.log("messageId==="+messageId);


	const payload = {
	    notification: {
	      title:"Hellooo",
	      icon: "https://placeimg.com/250/250/people",
	      click_action: "https://autorepair-1510293342488.firebaseapp.com"
	    }
	};
	admin.database()
	   .ref(`/fcmTokens`)
	   .on("value", function(snapshot){
	 		var counter=0;
	    	var token=snapshot.val();
	    	console.log("token===="+token);
	    	var userTokens=[];
	    	for(const prop in token)
	    	{
	    		// console.log("data==="+token[prop]);
	    		userTokens.push(token[prop]);
	    	}
	    	function checkUserToken()
			{
				if(userTokens.length>0)
				{
				    if(counter==userTokens.length)
	        		{

	        			userTokens=[];
	        		}
	        		else
	        		{
	        			notificationToAdmin(userTokens[counter]);

	        		}		
				}
					
			}
	    		
	    		
	    	checkUserToken();


	    	function notificationToAdmin(token)
	    	{
	    		admin.messaging().sendToDevice(token, payload).then((res)=>{
	    			console.log("Successfully got==="+JSON.stringify(res));
	    			counter++;
	    			checkUserToken();
	    			
	    		},error=>{
	    			console.log("Failed");
	    		})	
	    	}


	    	// console.log("key data==="+snapshot.key)
	  		// console.log(snapshot.val());
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
});



exports.fcmSendMessage = functions.database.ref('/messages/{messageId}').onCreate(event => {
  console.log("message sent============");
  var data=event.data.val();
  console.log("Data======"+JSON.stringify(data));
  admin.database()
	   .ref(`/user_detail/${data.receiverId}`)
	   .on("value", function(snapshot) {
	   		var user=snapshot.val();
	   		console.log("User info===="+JSON.stringify(user));
	   		if(user.deviceToken)
	   		{
	   			notificationToUser(user.deviceToken)
	   		}
	   		else
	   		{
	   			console.log("No Device token for user");
	   		}


	   			function notificationToUser(token)
	    	{

	    		console.log("user token145===="+token);
	    		const payload = {
				    notification: {
				      "title":"New Messages",
				      "body":data.editorMsg,
				      "sound":"default",
				      "click_action": "FCM_PLUGIN_ACTIVITY",
				      "icon": "https://placeimg.com/250/250/people",
				    },
				    data:
				        {
				        	"receiverId":data.receiverId,
					        "message":data.editorMsg,
					        "content-available": '1' //FOR CALLING ON NOTIFACATION FUNCTION EVEN IF THE APP IS IN BACKGROUND
					    },
				    "to":token,
					"priority":"high",
				};
	    		admin.messaging().sendToDevice(token, payload).then((res)=>{
	    			console.log("Successfully notify user"+JSON.stringify(res));
	    		},error=>{
	    			console.log("Failed=="+error);
	    		})	






	    	}

		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});

});
