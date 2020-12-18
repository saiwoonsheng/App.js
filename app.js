
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    //loader.show();
    //content.hide();

    var yourAdress = $("#yourAddress");
    yourAdress.empty();
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        var accTemplate = "<label>Owner Account: <h7 style='background-color:#ffcccb;'>" + App.account +"</h7></label><br>" 
        yourAdress.append(accTemplate);
        //content.show();
      }
    });
    
//test place
  
    
      
    
      
      
           

      
    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      // if(hasVoted) {
      //   $('form').hide();
      // }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });

   
  },
  
  openFile: function(e) {
    
    console.log(e);
      if(e != undefined) {
        var file = e.target.files[0];
        //console.log(e.target.files[0]);
          if(file != null && file.size > 0) {
            var reader = new FileReader ();
            
            reader.readAsArrayBuffer(file);
        //     reader.onload = function (e) {
        //       console.log (e.target.result);

        
        //  };
        reader.onloadend = convert(reader);
          } else {
            console.log("False");
          }
        }else {
          console.log("False");
        }
        function convert(reader){
          const buffer = Buffer.allocUnsafe(reader.result);
          console.log("Buffer : "+buffer)
        }
  },


  castVote: function() {

    var recAddress = $("#receiverAddress");
    var ownerName = $("#ownerName");
    ownerPhone = $("#phone");
    var teakCode = $("#teakCode");
    var speciesName = $("#speciesName");
    var location = $("#location");
    var certificate = $("#certificateTeak");
    var accAdress = $("#accountAddress");
    var row1="ใบอนุญาตทำไม้ เล่มที่ ("+ $("#row1_01").val() +") ฉบับที่ ("+$("#row1_02").val()+") ที่ทำการ ("+$("#row1_03").val()+") ลงวันที่ ("+$("#row1_04").val().trim()+")";
    var row2="หนังสือรับรองการแจ้งตัดหรือโค่นไม้ เล่มที่ ("+ $("#row2_01").val()+") ฉบับที่ ("+$("#row2_02").val()+") ที่ทำการ ("+$("#row2_03").val()+") ลงวันที่ ("+$("#row2_04").val().trim()+")";
    var row3="บัญชีรายการไม้ เล่มที่ ("+$("#row3_01").val()+") ฉบับที่ ("+$("#row3_02").val()+") ลงวันที่ ("+$("#row3_03").val().trim()+")";
    var row4="หนังสือรับรองการขึ้นทะเบียนตรา เล่มที่ ("+$("#row4_01").val()+") ฉบับที่ ("+$("#row4_02").val()+") ที่ทำการ ("+$("#row4_03").val()+") ลงวันที่ ("+$("#row4_04").val().trim()+")";
    var row5="ใบเบิกทางนำไม้เคลื่อนที่  เล่มที่ ("+$("#row5_01").val()+") ฉบับที่ ("+$("#row5_02").val()+") ที่ทำการ ("+$("#row5_03").val()+") ลงวันที่ ("+$("#row5_04").val().trim()+")";
    accAdress.empty();
    //var accTemplate = row1+"<br>"+row2+"<br>"+row3+"<br>"+row4+"<br>"+row5+"<br>"+ownerPhone.val()
    //accAdress.append(accTemplate);

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        var accTemplate = "<html><title></title><head><style>td { text-align: left; margin-right: 1em;} tr {height:28px;} .td {width:150px;}</style><head><body><hr /><table>"
        accAdress.append(accTemplate);
      }
    });
    function hex_to_ascii(str1)
    {
     var hex  = str1.toString();
     var str = '';
     for (var n = 0; n < hex.length; n += 2) {
       str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
     }
     console.log(str);
     return str;
     
    }
    function hexToBytes(hex) {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i !== bytes.length; i++) {
          bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
      }
      return bytes;
  }
      
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          
          if(recAddress.val()!="" && ownerName.val()!="" && teakCode.val()!="" && speciesName.val()!="" && location.val()!="" && certificate.val()!=""){
        web3.eth.sendTransaction({ 
          from: App.account,
          gasPrice: "20000000000",
          gas: "60000",
          to: recAddress.val(), 
          value: 0,
          data: "Owner Name:|"+ownerName.val()+"|Owner Phone:|"+ownerPhone.val()+"|Teak Code:|"+teakCode.val()+"|Teak Species Name:|"
                +speciesName.val()+"|Location of Planting:|"+location.val()+"|Certificate of Teak:|"
                +row1+"|"+row2+"|"+row3+"|"+row4+"|"+row5,
         }, function(err, transactionHash) {
          if (!err){
            console.log(transactionHash);

            var receipt = $("#receipt");
            receipt.empty();
            var accTemplate = "Transaction Receipt";
            receipt.append(accTemplate);

            var accTemplate = "<tr><td class='td'>Transaction Hash:</td><td> <h7 style='background-color:#76ff76;'>" + transactionHash +"</h7></td></tr>"
            accAdress.append(accTemplate);
             setTimeout(function() {
              web3.eth.getBlockNumber(function(error, bNumber) {
                var accTemplate = "<tr><td>Block Number:</td><td> <h7>" + bNumber +"</h7></td></tr>"
                accAdress.append(accTemplate);
                //Balance
                web3.eth.getCoinbase(function(err, account) {
                  if (err === null) {
                    App.account = account;  
              web3.eth.getBalance(account, web3.eth.defaultBlock,
                function(error,result){
                  if(error) {
                    console.error("Error while retrieving the balance for address["+account+"]: "+err);
                  } else {
                    var balance = web3.fromWei(result.toNumber());
                    console.log("Balance for address["+account+"]: "+balance);
                    var accTemplate = "<tr><td>Balance for address ["+account+"]:</td><td> <h7>"+balance+"</h7></td></tr>"
                    accAdress.append(accTemplate);
                  }
                }
              );
                  }
                });
                //end Balance
                //get Transaction
                web3.eth.getTransaction(transactionHash, function(err, txInfo) {
                  console.log(txInfo);
                  var accTemplate = "<tr><td class='td'>Block Hash:</td><td> <h7>"+txInfo.blockHash+"</h7></td></tr>"
                                  
                                  +"<tr><td>From:</td><td> <h7>"+txInfo.from+"</h7></td></tr>"
                                  +"<tr><td>To:</td><td> <h7>"+txInfo.to+"</h7></td></tr>"
                                  
                                  +"<tr><td>Transaction Index:</td><td> <h7>"+txInfo.transactionIndex+"</h7></td></tr>"
                                  +"<tr><td>Gas Limit:</td><td> <h7>"+txInfo.gas+"</h7></td></tr>"
                                  +"<tr><td>Gas Price:</td><td> <h7>"+txInfo.gasPrice+"</h7></td></tr>"
                                  +"<tr><td>Nonce:</td><td> <h7>"+txInfo.nonce+"</h7></td></tr>"
                                  +"<tr><td>Value:</td><td> <h7>"+txInfo.value+" Ether</h7></td></tr>"
                                  +"<tr><td>Input Data:</td><td> <h7 style='background-color:#ffffa1;'>"+new TextDecoder("UTF-8").decode(hexToBytes(txInfo.input))+"</h7></td></tr>"
                    accAdress.append(accTemplate);
                
                //get Block (time,txn fee, gas used)
                        web3.eth.getBlock(bNumber, function(err, getBlock) {
                          console.log(getBlock);
                          var gasP = web3.fromWei(txInfo.gasPrice, 'ether');
                          var transactionFee = gasP * txInfo.gas;
                              const milliseconds = getBlock.timestamp * 1000 
                              
                              const dateObject = new Date(milliseconds)
                              
                              const timestamp = dateObject.toLocaleString("en-US", {timeZoneName: "short"}) 
                          var accTemplate = "<tr><td>Timestamp:</td><td> <h7>"+timestamp+"</h7></td></tr>"
                                            +"<tr><td>Gas Used:</td><td> <h7>"+getBlock.gasUsed+"</h7></td></tr>"
                                            +"<tr><td>Parent Hash:</td><td> <h7>"+getBlock.parentHash+"</h7></td></tr>"
                                            +"<tr><td>Transaction Fee:</td><td> <h7>"+transactionFee+" Ether</h7></td></tr></table></body></html>"
                          accAdress.append(accTemplate);
                    }); // end get Block (time,txn fee, gas used)

              }); //end get Transaction

              });  
            },20000);
          }
        }); 
      }
    }
      });
    
  },

  displayReceipt: function() {
    var accAdress = $("#accountAddress");
    var receipt = $("#receipt");
    accAdress.empty();
    receipt.empty();
    var accTemplate = "Transaction Receipt";
    receipt.append(accTemplate);
    var accTemplate = "<hr /><html><title></title><head><style>td { text-align: left; margin-right: 1em;}"
    +"tr {height:28px;} .td {width:150px;} .input {border: none; border-color: transparent; width: 505px; border: none transparent;"
     +" outline: none;}</style><head><body>"
    accAdress.append(accTemplate);

    
    function hexToBytes(hex) {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i !== bytes.length; i++) {
          bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
      }
      return bytes;
  }
//   web3.eth.getBlockNumber(function(error, bNumber) {
//     if(error === null){
//       for (i = bNumber; i >= 0; i--) {
//         web3.eth.getBlock(i, function(err, getBlock) {
//                 const milliseconds = getBlock.timestamp * 1000 
//                 const dateObject = new Date(milliseconds)
//                 const timestamp = dateObject.toLocaleString("en-US", {timeZoneName: "short"})
//         if(err === null){
//         web3.eth.getTransaction(getBlock.transactions, function(err, txInfo) {
//                   var gasP = web3.fromWei(txInfo.gasPrice, 'ether');
//                   var transactionFee = gasP * txInfo.gas;
//             //console.log(new TextDecoder("UTF-8").decode(hexToBytes(txInfo.input)));
//                 var accTemplate = "<table style='width: 100%;'><tr><td class='td'>Block Number:</td><td> <h7>"+getBlock.number+"</h7></td></tr>"
//                     +"<tr><td>Block Hash:</td><td> <h7>"+txInfo.blockHash+"</h7></td></tr>"
//                     +"<tr><td>Parent Hash:</td><td> <h7>"+getBlock.parentHash+"</h7></td></tr>"              
//                     +"<tr><td>From:</td><td> <h7>"+txInfo.from+"</h7></td></tr>"
//                     +"<tr><td>To:</td><td> <h7>"+txInfo.to+"</h7></td></tr>"
//                     +"<tr><td>Transaction Hash:</td><td>"
//                     +"<input class='input' id='"+i+"' value='"+getBlock.transactions+"' style='background-color:#76ff76;' readonly>"
// +"<button id='"+i+"' class='btn' style='background-color:white' data-clipboard-target='#foo' onclick='myFunction()'><img src='\clippy-16.svg' alt='Copy to clipboard'></button>"

//                     +"</td></tr>"            
//                     +"<tr><td>Transaction Index:</td><td> <h7>"+txInfo.transactionIndex+"</h7></td></tr>"
                    
//                     +"<tr><td>Gas Limit:</td><td> <h7>"+txInfo.gas+"</h7></td></tr>"
//                     +"<tr><td>Gas Price:</td><td> <h7>"+txInfo.gasPrice+"</h7></td></tr>"
//                     +"<tr><td>Gas Used:</td><td> <h7>"+getBlock.gasUsed+"</h7></td></tr>"
//                     +"<tr><td>Timestamp:</td><td> <h7>"+timestamp+"</h7></td></tr>"
//                     +"<tr><td>Nonce:</td><td> <h7>"+txInfo.nonce+"</h7></td></tr>"
//                     +"<tr><td>Value:</td><td> <h7>"+txInfo.value+" Ether</h7></td></tr>"
//                     +"<tr><td>Transaction Fee:</td><td> <h7>"+transactionFee+"</h7></td></tr>"
//                     +"<tr><td>Input Data:</td><td> <h7>"+new TextDecoder("UTF-8").decode(hexToBytes(txInfo.input))+"</h7></td></tr></table><hr />"
//                     accAdress.append(accTemplate);
//           });
//         }
//       });
//       }
//     }
//   });
    web3.eth.getBlockNumber(function(error, bNumber) {
        if(error === null){
          let i;
          for (i = bNumber; i >= 0; i--) {
            setTimeout(function(i) {
            web3.eth.getBlock(i, function(err, getBlock) {
              
              if(err === null){
                const milliseconds = getBlock.timestamp * 1000 
                const dateObject = new Date(milliseconds)
                const timestamp = dateObject.toLocaleString("en-US", {timeZoneName: "short"})

              web3.eth.getTransaction(getBlock.transactions, function(err, txInfo) {
                
                var gasP = web3.fromWei(txInfo.gasPrice, 'ether');
                var transactionFee = gasP * txInfo.gas;

    var accTemplate = "<table style='width: 100%;'><tr><td class='td'>Block Number:</td><td> <h7>"+getBlock.number+"</h7></td></tr>"
                    +"<tr><td>Block Hash:</td><td> <h7>"+txInfo.blockHash+"</h7></td></tr>"
                    +"<tr><td>Parent Hash:</td><td> <h7>"+getBlock.parentHash+"</h7></td></tr>"              
                    +"<tr><td>From:</td><td> <h7>"+txInfo.from+"</h7></td></tr>"
                    +"<tr><td>To:</td><td> <h7>"+txInfo.to+"</h7></td></tr>"
                    +"<tr><td>Transaction Hash:</td><td>"
                    +"<input class='input' id='"+i+"' value='"+getBlock.transactions+"' style='background-color:#76ff76;' readonly>"
+"<button id='"+i+"' class='btn' style='background-color:white' data-clipboard-target='#foo' onclick='myFunction()'><img src='\clippy-16.svg' alt='Copy to clipboard'></button>"

                    +"</td></tr>"            
                    +"<tr><td>Transaction Index:</td><td> <h7>"+txInfo.transactionIndex+"</h7></td></tr>"
                    
                    +"<tr><td>Gas Limit:</td><td> <h7>"+txInfo.gas+"</h7></td></tr>"
                    +"<tr><td>Gas Price:</td><td> <h7>"+txInfo.gasPrice+"</h7></td></tr>"
                    +"<tr><td>Gas Used:</td><td> <h7>"+getBlock.gasUsed+"</h7></td></tr>"
                    +"<tr><td>Timestamp:</td><td> <h7>"+timestamp+"</h7></td></tr>"
                    +"<tr><td>Nonce:</td><td> <h7>"+txInfo.nonce+"</h7></td></tr>"
                    +"<tr><td>Value:</td><td> <h7>"+txInfo.value+" Ether</h7></td></tr>"
                    +"<tr><td>Transaction Fee:</td><td> <h7>"+transactionFee+"</h7></td></tr>"
                    +"<tr><td>Input Data:</td><td> <h7>"+new TextDecoder("UTF-8").decode(hexToBytes(txInfo.input))+"</h7></td></tr></table><hr />"
                    accAdress.append(accTemplate);
              
                

              });
            }
          
          });
        }, 3000, i);
        }

        
        }
      });
      
        // var accTemplate ="<script src='\clipboard.min.js'></script>"
        // +"<script> function myFunction() {"
        // +"var buttons = document.getElementsByTagName('button');var buttonsCount = buttons.length;for (var i = 0; i < buttonsCount; i += 1) {buttons[i].onclick = function(e) {var id = this.id.toString();"
        // +"console.log(buttons.length);"
        // +"var copyText = document.getElementById(id.toString()); copyText.select();"
        // +"copyText.setSelectionRange(0, 99999); document.execCommand('copy'); } };}</script>"
        // +"</body></html>";
        // accAdress.append(accTemplate); 
      
  },

  confirmTeak: function() {
    var recAddress = $("#receiverAddress");
    var staffName = $("#staffName");
    var staffID = $("#staffID");
    var confirmTxn = $("#confirmTxn");
    var accAdress = $("#accountAddress");
    accAdress.empty();
    
    Txn = new Array(2);
    Txn[0]=confirmTxn.val().trim();

    function hex_to_ascii(str1)
    {
     var hex  = str1.toString();
     var str = '';
     for (var n = 0; n < hex.length; n += 2) {
       str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
     }
     console.log(str);
     return str;
     
    }
    function hexToBytes(hex) {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i !== bytes.length; i++) {
          bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
      }
      return bytes;
  }

    web3.eth.getTransaction(Txn[0], function(err, txInfo) {
      console.log(txInfo);

      
      inputData = new TextDecoder("UTF-8").decode(hexToBytes(txInfo.input));
      res1 = inputData.split("0x");
      res2 = res1[1].split("|");
      console.log(res2);
      if(res2.length==16){

      var receipt = $("#receipt");
      accAdress.empty();
      receipt.empty();
      var accTemplate = "Transaction Receipt";
      receipt.append(accTemplate);

      recAddress.val(txInfo.from);
      var accTemplate = "<hr /><html><title></title><head><style>td { text-align: left; margin-right: 1em;}"
                      +"tr {height:25px;} .td {width:150px;}</style><head><body>"
                      +"<table style='width: 100%;'>"
                      +"<tr><td class='td'>"+res2[0]+"</td><td>"+res2[1]+"</td></tr><tr><td>"+res2[2]+"</td><td>"+res2[3]+"</td></tr>"
                      +"<tr><td>"+res2[4]+"</td><td>"+res2[5]+"</td></tr><tr><td>"+res2[6]+"</td><td>"+res2[7]+"</td></tr>"
                      +"<tr><td>"+res2[8]+"</td><td>"+res2[9]+"</td></tr>"
                      +"<tr><td>"+res2[10]+"</td><td>"+res2[11]+"<br>"+res2[12]+"<br>"+res2[13]+"<br>"+res2[14]+"<br>"+res2[15]+"</td></tr>"
                      +"<tr><td colspan='2'><label>Verified By:</label></td></tr>"
                      +"<tr><td>Staff Name:</td><td>"+staffName.val()+"</td></tr><tr><td>Staff ID:</td><td>"+staffID.val()+"</td></tr>"
                      +"</table></body></html><hr />"
      accAdress.append(accTemplate);

      web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      if(staffName.val()!="" && staffID.val()!=""){

      web3.eth.sendTransaction({ 
        from: App.account,
        gasPrice: "20000000000",
        gas: "60000",
        to: recAddress.val(), 
        value: 0,
        data: "Verified by Staff Name:|"+staffName.val()+"|Staff ID:|"+staffID.val()+"|"
              +res2[0]+"|"+res2[1]+"|"+res2[2]+"|"+res2[3]+"|"+res2[4]+"|"+res2[5]+"|"
              +res2[6]+"|"+res2[7]+"|"+res2[8]+"|"+res2[9]+"|"+res2[10]+"|"+res2[11]+"|"
              +res2[12]+"|"+res2[13]+"|"+res2[14]+"|"+res2[15]+"",
       }, function(err, transactionHash) {
        if (!err){
          Txn[1]=transactionHash;
          setTimeout(function() {

            var accTemplate = "<html><title></title><head><style>td { text-align: left; margin-right: 1em;}"
            +"tr {height:25px;} .td {width:150px;}</style><head><body>"

            accAdress.append(accTemplate);
 
          var i;
          for (i = Txn.length-1; i >= 0 ; i--) {
              console.log(Txn[i]);
              web3.eth.getTransaction(Txn[i], function(err, txInfo) {

                web3.eth.getBlock(txInfo.blockNumber, function(err, getBlock) {

                const milliseconds = getBlock.timestamp * 1000 
                const dateObject = new Date(milliseconds)
                const timestamp = dateObject.toLocaleString("en-US", {timeZoneName: "short"})
                var gasP = web3.fromWei(txInfo.gasPrice, 'ether');
                var transactionFee = gasP * txInfo.gas;

                var accTemplate = "<table style='width: 100%;'>"
                +"<tr><td class='td'>Block Number:</td><td> <h7>"+getBlock.number+"</h7></td></tr>"
                +"<tr><td>Block Hash:</td><td> <h7>"+txInfo.blockHash+"</h7></td></tr>"
                +"<tr><td>Parent Hash:</td><td> <h7>"+getBlock.parentHash+"</h7></td></tr>"              
                +"<tr><td>From:</td><td> <h7>"+txInfo.from+"</h7></td></tr>"
                +"<tr><td>To:</td><td> <h7>"+txInfo.to+"</h7></td></tr>"
                +"<tr><td>Transaction Hash:</td><td> <h7 style='background-color:#76ff76;'>"+getBlock.transactions+"</h7></td></tr>"            
                +"<tr><td>Transaction Index:</td><td> <h7>"+txInfo.transactionIndex+"</h7></td></tr>"
                
                +"<tr><td>Gas Limit:</td><td> <h7>"+txInfo.gas+"</h7></td></tr>"
                +"<tr><td>Gas Price:</td><td> <h7>"+txInfo.gasPrice+"</h7></td></tr>"
                +"<tr><td>Gas Used:</td><td> <h7>"+getBlock.gasUsed+"</h7></td></tr>"
                +"<tr><td>Timestamp:</td><td> <h7>"+timestamp+"</h7></td></tr>"
                +"<tr><td>Nonce:</td><td> <h7>"+txInfo.nonce+"</h7></td></tr>"
                +"<tr><td>Value:</td><td> <h7>"+txInfo.value+" Ether</h7></td></tr>"
                +"<tr><td>Transaction Fee:</td><td> <h7>"+transactionFee+"</h7></td></tr>"
                +"<tr><td>Input Data:</td><td> <h7>"+new TextDecoder("UTF-8").decode(hexToBytes(txInfo.input))+"</h7></td></tr></table><hr />"
                accAdress.append(accTemplate);

                });
              });
          }
        },30000);        
        var accTemplate = "</body></html><hr />"
        accAdress.append(accTemplate);
        }
      }); 
 }     
    }
    }); 
    }
    else{
      alert("Transaction Hash Invalid")
    }  
    });
    
        
    
    
  },
  process: function() {

    var recAddress = $("#receiverAddress");
    var manufName = $("#manufacturerName");
    var recDate = $("#receiveDate");
    var manufDate = $("#manufacturingDate");
    var checkTxn = $("#checkTxn");
    var accAdress = $("#accountAddress");
    accAdress.empty();
    
    Txn = new Array(3);
    Tn = new Array(1);
Txn[1]=checkTxn.val().trim();
var timestamps = new Array(1);

    function hex_to_ascii(str1)
    {
     var hex  = str1.toString();
     var str = '';
     for (var n = 0; n < hex.length; n += 2) {
       str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
     }
     console.log(str);
     return str;
     
    }
    function hexToBytes(hex) {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i !== bytes.length; i++) {
          bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
      }
      return bytes;
  }

    web3.eth.getTransaction(Txn[1], function(err, txInfo) {
      
      var receipt = $("#receipt");
      receipt.empty();
      var accTemplate = "Transaction Receipt";
      receipt.append(accTemplate);
      console.log(txInfo);

      inputData = new TextDecoder("UTF-8").decode(hexToBytes(txInfo.input));
      res1 = inputData.split("0x");
      res2 = res1[1].split("|");
      res3 = res2[0].split(" Staff Name");
      res4 = res2[0].split("Verified by ");
      console.log(res2);
      if(res2.length==20){
      recAddress.val(txInfo.to);
      web3.eth.getBlock(txInfo.blockNumber, function(err, getBlock) {
        milliseconds = getBlock.timestamp * 1000 
        dateObject = new Date(milliseconds)
        timestamps[0] = dateObject.toLocaleString("en-US", {timeZoneName: "short"})
                
      
      var accTemplate = "<hr /><html><title></title><head><style>td { text-align: left; margin-right: 1em;}"
                      +"tr {height:25px;} .td {width:150px;}</style><head><body>"
                      +"<table style='width: 100%;'>"
                      +"<tr><td class='td'>"+res2[4]+"</td><td>"+res2[5]+"</td></tr><tr><td>"+res2[6]+"</td><td>"+res2[7]+"</td></tr>"
                      +"<tr><td>"+res2[8]+"</td><td>"+res2[9]+"</td></tr><tr><td>"+res2[10]+"</td><td>"+res2[11]+"</td></tr>"
                      +"<tr><td>"+res2[12]+"</td><td>"+res2[13]+"</td></tr>"
                      +"<tr><td>"+res2[14]+"</td><td>"+res2[15]+"<br>"+res2[16]+"<br>"+res2[17]+"<br>"+res2[18]+"<br>"+res2[19]+"</td></tr>"
                      +"<tr><td colspan='2'><label>"+res3[0]+"</label></td></tr>"
                      +"<tr><td>"+res4[1]+"</td><td>"+res2[1]+"</td></tr><tr><td>"+res2[2]+"</td><td>"+res2[3]+"</td></tr>"
                      +"<tr><td>Verified Date:</td><td>"+timestamps[0]+"</td></tr>"                      
                      +"<tr><td colspan='2'><label>Received By</label></td></tr>"
                      +"<tr><td>Manufacturer Name:</td><td>"+manufName.val()+"</td></tr><tr><td>Teak Received Date:</td><td>"
                      +recDate.val()+"</td></tr>"
                      +"<tr><td>Manufacturing Date:</td><td>"+manufDate.val()+"</td></tr>"
                      +"</table></body></html><hr />"
      accAdress.append(accTemplate);
      
      var getLastTxn1 = res2[4]+"|"+res2[5]+"|"+res2[6]+"|"+res2[7]+"|"+res2[8]+"|"
                        +res2[9]+"|"+res2[10]+"|"+res2[11]+"|"+res2[12]+"|"+res2[13]+"|"
                        +res2[14]+"|"+res2[15]+"|"+res2[16]+"|"
                        +res2[17]+"|"+res2[18]+"|"+res2[19]
      console.log(getLastTxn1+"           ------------------------               ")
      web3.eth.getBlockNumber(function(error, bNumber) {
        if(error === null){
          let i; let j=bNumber;
          for (i = bNumber; i >= 1; i--) {
            setTimeout(function(i) {
            web3.eth.getBlock(i, function(err, getBlock) {
              
              if(err === null){
                web3.eth.getTransaction(getBlock.transactions, function(err, txInfo) {
                  
                  inputData = new TextDecoder("UTF-8").decode(hexToBytes(txInfo.input));
                  res1 = inputData.split("0x");
                  //console.log(res1[1])
                  if(getLastTxn1 == res1[1]){
                    console.log(Tn[0]=i)
                    web3.eth.getBlock(Tn[0], function(err, getBlock) {
              
        trans = getBlock.transactions
                      Txn[0]=trans.toString()
                        
                    });
                  }else{
                    console.log("False")
                    
                  }
                  
                  //j--
                });
              }
            });
          },2000,i); 
          }
        
        }
      });

    setTimeout(function() {
      console.log(Tn)
      console.log(Txn)
    },2500); 

      web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        if(manufName.val()!="" && recDate.val()!="" && manufDate.val()!=""){
      web3.eth.sendTransaction({ 
        from: App.account,
        gasPrice: "20000000000",
        gas: "60000",
        to: recAddress.val(), 
        value: 0,
        data: "Received Teak by Manufacturer Name:|"+manufName.val()+"|Teak Received Date:|"+recDate.val()+"|"
              +"Manufacturing Date:|"+manufDate.val()+"|"+res2[0]+"|"+res2[1]+"|"+res2[2]+"|"+res2[3]+"|"
              +"Verified Date:|"+timestamps[0]+"|"+res2[4]+"|"+res2[5]+"|"
              +res2[6]+"|"+res2[7]+"|"+res2[8]+"|"+res2[9]+"|"
              +res2[10]+"|"+res2[11]+"|"+res2[12]+"|"+res2[13]+"|"+res2[14]+"| "+res2[15]+"| "
              +res2[16]+"| "+res2[17]+"| "+res2[18]+"| "+res2[19]+"",
       }, function(err, transactionHash) {
        if (!err){
          Txn[2]=transactionHash;
          setTimeout(function() {
            var receipt = $("#receipt");
            //accAdress.empty();
            receipt.empty();
            var accTemplate = "Transaction Receipt";
            receipt.append(accTemplate);
            var accTemplate = "<html><title></title><head><style>td { text-align: left; margin-right: 1em;}"
            +"tr {height:25px;} .td {width:150px;}</style><head><body>"

            accAdress.append(accTemplate);
          var i;
          for (i = Txn.length-1; i >= 0 ; i--) {
              console.log(Txn[i]);
              web3.eth.getTransaction(Txn[i], function(err, txInfo) {

                web3.eth.getBlock(txInfo.blockNumber, function(err, getBlock) {

                const milliseconds = getBlock.timestamp * 1000 
                const dateObject = new Date(milliseconds)
                const timestamp = dateObject.toLocaleString("en-US", {timeZoneName: "short"})
                var gasP = web3.fromWei(txInfo.gasPrice, 'ether');
                var transactionFee = gasP * txInfo.gas;
console.log(transactionFee);
                var accTemplate = "<table style='width: 100%;'>"
                +"<tr><td class='td'>Block Number:</td><td> <h7>"+getBlock.number+"</h7></td></tr>"
                +"<tr><td>Block Hash:</td><td> <h7>"+txInfo.blockHash+"</h7></td></tr>"
                +"<tr><td>Parent Hash:</td><td> <h7>"+getBlock.parentHash+"</h7></td></tr>"              
                +"<tr><td>From:</td><td> <h7>"+txInfo.from+"</h7></td></tr>"
                +"<tr><td>To:</td><td> <h7>"+txInfo.to+"</h7></td></tr>"
                +"<tr><td>Transaction Hash:</td><td> <h7 style='background-color:#76ff76;'>"+getBlock.transactions+"</h7></td></tr>"            
                +"<tr><td>Transaction Index:</td><td> <h7>"+txInfo.transactionIndex+"</h7></td></tr>"
                
                +"<tr><td>Gas Limit:</td><td> <h7>"+txInfo.gas+"</h7></td></tr>"
                +"<tr><td>Gas Price:</td><td> <h7>"+txInfo.gasPrice+"</h7></td></tr>"
                +"<tr><td>Gas Used:</td><td> <h7>"+getBlock.gasUsed+"</h7></td></tr>"
                +"<tr><td>Timestamp:</td><td> <h7>"+timestamp+"</h7></td></tr>"
                +"<tr><td>Nonce:</td><td> <h7>"+txInfo.nonce+"</h7></td></tr>"
                +"<tr><td>Value:</td><td> <h7>"+txInfo.value+" Ether</h7></td></tr>"
                +"<tr><td>Transaction Fee:</td><td> <h7>"+transactionFee+"</h7></td></tr>"
                +"<tr><td>Input Data:</td><td> <h7>"+new TextDecoder("UTF-8").decode(hexToBytes(txInfo.input))+"</h7></td></tr></table><hr />"
                accAdress.append(accTemplate);

                });
              });
          }
        },31000);
        var accTemplate = "</body></html><hr />"
        accAdress.append(accTemplate);  
        }
      }); 
    }
  }
    }); 
  });
  }else{
    alert("Transaction Hash Invalid")
  }
    });
  },
   
  search: function() {
    var searchTxn = $("#searchTxn");
    var accAdress = $("#accountAddress");
    accAdress.empty();
    function hex_to_ascii(str1)
    {
     var hex  = str1.toString();
     var str = '';
     for (var n = 0; n < hex.length; n += 2) {
       str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
     }
     console.log(str);
     return str;
     
    }
    function hexToBytes(hex) {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i !== bytes.length; i++) {
          bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
      }
      return bytes;
  }
    var qrcode = $("#qrcode");
    qrcode.empty();
    web3.eth.getTransaction(searchTxn.val().trim(), function(err, txInfo) {
      console.log(txInfo);

      
      inputData = hex_to_ascii(txInfo.input);
      res1 = inputData.split("0x");
      res2 = res1[1].split("|");
      res3 = res2[0].split(" Manufacturer Name");
      res4 = res2[0].split("Received Teak by ");//[1]
      res5 = res2[6].split(" Staff Name");
      res6 = res2[6].split("Verified by ");//[1]
      console.log(res2);
      // test = hex_to_ascii("e0b984e0b8a1e0b989e0b8aae0b8b1e0b881e0b8abe0b8b4e0b899")
      
      if(res2[19] == "à¹à¸¡à¹à¸ªà¸±à¸à¸à¸­à¸"){
        sp = "ไม้สักทอง"
      }else if(res2[19] == "à¹à¸¡à¹à¸ªà¸±à¸à¸¥à¸²à¸¢à¸à¸³"){
        var sp = "ไม้สักลายดำ"
      }else if(res2[19] == "à¹à¸¡à¹à¸ªà¸±à¸à¸«à¸¢à¸§à¸"){
        var sp = "ไม้สักหยวก"
      }else if(res2[19] == "à¹à¸¡à¹à¸ªà¸±à¸à¹à¸"){
        var sp = "ไม้สักไข"
      }else if(res2[19] == "à¹à¸¡à¹à¸ªà¸±à¸à¸à¸µà¹à¸à¸§à¸²à¸¢"){
        var sp = "ไม้สักขี้ควาย"
      }else if(res2[19] == "à¹à¸¡à¹à¸ªà¸±à¸à¸«à¸´à¸"){
        var sp = "ไม้สักหิน"
      }

      if(res2.length==28){
        var receipt = $("#receipt");
        var forPhone = $("#forPhone");
        var middle = $("#middle");
        var last = $("#last");
        var trr = $("#trr");
        var trP = $("#trPhone");
        var tt = $("#tt");
        
        accAdress.empty();
        receipt.empty();
        middle.empty();
        last.empty();
        forPhone.empty();
        trr.empty();
        trP.empty();
        tt.empty();
        
        var accTemplate = "Transaction Receipt";
        receipt.append(accTemplate);

        times = res2[11].split("GMT+6:30")
        console.log(times[0])
        
      var accTemplate ="<hr /><html><title></title><head><style>td { text-align: left; margin-right: 1em;}"
                      +"tr {height:25px;} .td {width:150px;} .tr {height:40px;}</style><head><body>"
                      +"<table style='width: 100%;'>"
                      +"<tr class='tr'><td class='td'>"+res2[12]+"</td><td>"+res2[13]+"</td></tr><tr><td>"+res2[14]+"</td><td>"+res2[15]+"</td></tr>"
                      +"<tr class='tr'><td>"+res2[16]+"</td><td>"+res2[17]+"</td></tr>"

      var accTemplate0="<tr><td class='td'>"+res2[18]+"</td><td>"+sp.toString()+"</td></tr>"

      var accTemplate0_0="<tr><td class='td'>"+res2[18]+"</td><td>"+res2[19]+"</td></tr>"

      var accTemplate0_1="<tr><td class='td'>"+res2[20]+"</td><td>"+res2[21]+"</td></tr>"
                      
      var accTemplate2 ="<tr><td class='td'>"+res2[22]+"</td><td>"+res2[23]+"<br>"+res2[24]+"<br>"+res2[25]+"<br>"+res2[26]+"<br>"+res2[27]+"</td></tr>"
                      
      var accTemplate3 ="<tr><td colspan='2'><label>"+res5[0]+"</label></td></tr>"
                      +"<tr><td class='td'>"+res6[1]+"</td><td>"+res2[7]+"</td></tr><tr><td>"+res2[8]+"</td><td>"+res2[9]+"</td></tr>"
                      +"<tr><td class='td'>"+res2[10]+"</td><td>"+times[0]+"</td></tr>"
                      +"<tr><td colspan='2'><label>"+res3[0]+"</label></td></tr>"
                      +"<tr><td>"+res4[1]+"</td><td>"+res2[1]+"</td></tr><tr><td>"+res2[2]+"</td><td>"
                      +res2[3]+"</td></tr>"
                      +"<tr><td>"+res2[4]+"</td><td>"+res2[5]+"</td></tr></table>"

      accAdress.append(accTemplate);
      trr.append(accTemplate0);
      trP.append(accTemplate0_0);
      trP.hide();
      tt.append(accTemplate0_1);
      forPhone.append(accTemplate2);
      forPhone.hide();

      inputData = new TextDecoder("UTF-8").decode(hexToBytes(txInfo.input));
      res1 = inputData.split("0x");
      res2 = res1[1].split("|");
      res3 = res2[0].split(" Manufacturer Name");
      res4 = res2[0].split("Received Teak by ");//[1]
      res5 = res2[6].split(" Staff Name");
      res6 = res2[6].split("Verified by ");//[1]
      var accTemplate = "<tr><td class='td'>"+res2[22]+"</td><td>"+res2[23]+"<br>"+res2[24]+"<br>"+res2[25]+"<br>"+res2[26]+"<br>"+res2[27]+"</td></tr>"
                      
      middle.append(accTemplate);
      last.append(accTemplate3);
      var accTemplate ="<div class='form-group'><button type='submit' class='btn btn-primary' onclick='generateQRCode()' style='width: 150px;'>Generate QR Code</button>"
                      +"</div><hr />"
                      +"<div class='form-group'>"
                      +"<canvas id='qr-code'></canvas>"        
                      +"</div>"
     qrcode.append(accTemplate);
    //  var qrImg = $("#qr-code")[0].toDataURL("image/png");
    //  var accTemplate ="<br><a href="+qrImg+" target='_blank' download='image.png'>ss</a>"
    //  qrcode.append(accTemplate);
      
      }else{
          alert("Invalid Transaction Hash");
        
      }
      
    });
  },
  test: function() {
    var accAdress = $("#accountAddress");
    accAdress.empty();

    web3.eth.sendTransaction({ 
      from: App.account,
      gasPrice: "20000000000",
      gas: "99999",
      to: App.account, 
      value: 0,
      data: "",
     }, function(err, transactionHash) {
     });

    var accTemplate ="Hello World!"
    accAdress.append(accTemplate);
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
