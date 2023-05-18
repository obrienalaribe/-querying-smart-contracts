var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://root:password123@localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("blockchain");
  var myobj = [
    { account: '0x1FaafF91274234b0E0bfA154229057558da51125', amount: 1000},
    { account: '0xd90c859b228a55648d4dec90C9AC7a9545B17C0D', amount: 1000 },
    { account: '0x49FbCe8767fD404257fa973A0f00D379C4816803', amount: 2000 },
    { account: '0x812A39bb62b8B53F3340454531F6f2D346929a04', amount: 3000 },
    { account: '0x07Ef39cA542927137c7e5940a10330Ec6b6a624a', amount: 4000 },
    { account: '0x91e8a73FE3D2D1eF48965703DD1F0Ac366f7A9b8', amount: 3000 },
    { account: '0x91e8a73FE3D2D1eF48965703DD1F0Ac366f7A9b8', amount: 2 },
    { account: '0xA167637993F692AABd4B9A9F5F6fC361A64E87aa', amount: 4343},
    { account: '0x722BFEDea4a330084c3742662BD11DE364Bb012d', amount: 32212},
    { account: '0xB521715be6D5c0425e6608C2920Bed98e5e929E4', amount: 32121},
    { account: '0x3Cd763A52351719FBA70077C3B22671A03BfD9ae', amount: 43434},
    { account: '0x973322F3f3d6eA384DBc5a1736C4B1F57Cc6db9f', amount: 55453},
    { account: '0x6A8398a0234f3e9a309f4cb538E17Cdd9b879cC4', amount: 645645},
    { account: '0x00ED6c13d9827cB6aEc192941F17c811249dc12d', amount: 674545}
  ];
//     dbo.collection("bsc").insertMany(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("Number of documents inserted: " + res.insertedCount);
//     db.close();
//   });

  var query = { account: "0x973322F3f3d6eA384DBc5a1736C4B1F57Cc6db9f".toLowerCase() };

  dbo.collection("bsc").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });

  const normalCase = "0x973322F3f3d6eA384DBc5a1736C4B1F57Cc6db9f"
  const lowerCase = "0x973322f3f3d6ea384dbc5a1736c4b1f57cc6db9f"
  const result = normalCase === lowerCase
  console.log(`Equal check: ${result}`);

});
