let luckCards : Array<any> = [
  {
    "type": "goto",
    "description": "Advance to Deauville",
    "position": 39,
  },
  {
    "type": "goto",
    "description": "Advance to Go (collect ₩200)",
    "position": 0,
  },
  {
    "type": "goto",
    "description": "Advance to Dieppe. If you pass Go, collect ₩200",
    "position": 24,
  },
  {
    "type": "goto",
    "description": "Advance to Pointe du Hoc. If you pass Go, collect ₩200",
    "position": 11,
  },
  {
    "type": "gotoRail",
    "description": "Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay wonder twice the rental to which they are otherwise entitled",
    "position": 2,
  },
  {
    "type": "gotoRail",
    "description": "Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay wonder twice the rental to which they are otherwise entitled",
    "position": 2,
  },
  {
    "type": "gotoUtility",
    "description": "Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times amount thrown",
    "position": 10,
  },
  {
    "type": "pay",
    "description": "Bank pays you dividend of ₩50",
    "amount": 50,
  },
  {
    "type": "goBack",
    "description": "Go Back 3 Spaces",
  },
  {
    "type": "inJail",
    "description": "Go to Jail. Go directly to Jail, do not pass Go, do not collect ₩200",
  },
  {
    "type": "repair",
    "description": "Make general repairs on all your property. For each house pay ₩25. For each hotel pay ₩100",
  },
  {
    "type": "pay",
    "description": "Speeding fine ₩15",
    "amount": -15,
  },
  {
    "type": "goto",
    "description": "Take a trip to Rouen Railroad. If you pass Go, collect ₩200.",
    "position": 5,
  },
  {
    "type": "freeJail",
    "description": "You have a free jail card, you can use it to get free or trade it for money"
  },
  {
    "type": "chairman",
    "description": "You have been elected Chairman of the Board. Pay each player ₩50"
  },
  {
    "type": "pay",
    "description": "Your building loan matures. Collect ₩150",
    "amount": 150
  }
]

let companyCards : Array<any> = [

  {
    "type": "pay",
    "description": "Holiday fund matures. Receive ₩100",
    "amount": 100,
  },
  {
    "type": "goto",
    "description": "Advance to Go (collect ₩200)",
    "position": 0,
  },
  {
    "type": "pay",
    "description": "Income tax refund. Collect ₩20",
    "amount": 20,
  },
  {
    "type": "pay",
    "description": "Life insurance matures. Collect ₩100",
    "amount": 100,
  },
  {
    "type": "pay",
    "description": "Pay hospital fees of ₩100",
    "amount": -100,
  },
  {
    "type": "pay",
    "description": "Pay school fees of ₩50",
    "amount": -50,
  },
  {
    "type": "pay",
    "description": "Receive ₩25 consultancy fee",
    "amount": 25,
  },
  {
    "type": "pay",
    "description": "Bank error in your favor. Collect ₩200",
    "amount": 200,
  },
  {
    "type": "pay",
    "description": "You have won second prize in a beauty contest. Collect ₩10",
    "amount": 10
  },
  {
    "type": "inJail",
    "description": "Go to Jail. Go directly to Jail, do not pass Go, do not collect ₩200",
  },
  {
    "type": "repair",
    "description": "You are assessed for street repair. ₩40 per house. ₩115 per hotel",
  },
  {
    "type": "pay",
    "description": "Doctor's fee. Pay ₩50",
    "amount": -50,
  },
  {
    "type": "pay",
    "description": "You inherit ₩100",
    "amount": 100,
  },
  {
    "type": "freeJail",
    "description": "You have a free jail card, you can use it to get free or trade it for money"
  },
  {
    "type": "birthday",
    "description": "It is your birthday. Collect ₩10 from every player"
  },
  {
    "type": "pay",
    "description": "From sale of stock you get ₩50",
    "amount": 50
  }
]

export let Cards_json : Array<any> = [
  {
    "type": "cities",
    "name": "Vire",
    "rent" : [2, 10, 30, 90, 160, 250],
    "buildCost": 50,
    "mortage": false,
    "cost": 60,
    "bg": "",
    "fg": "",
    "color": "brown",
    "pos": 1
  },
  {
    "type": "cities",
    "name": "Le-Mont-Saint-Michel",
    "rent" : [4, 20, 60, 180, 360, 450],
    "buildCost": 50,
    "mortage": false,
    "cost": 60,
    "bg": "",
    "fg": "",
    "color": "brown",
    "pos": 3
  },
  {
    "type": "cities",
    "name": "Alençon",
    "rent" : [6, 30, 90, 270, 400, 550],
    "buildCost": 50,
    "mortage": false,
    "cost": 100,
    "bg": "",
    "fg": "",
    "color": "light blue",
    "pos": 6
  },
  {
    "type": "cities",
    "name": "Villedieu-Les-Poêles",
    "rent" : [6, 30, 90, 270, 400, 550],
    "buildCost": 50,
    "mortage": false,
    "cost": 60,
    "bg": "",
    "fg": "",
    "color": "light blue",
    "pos": 8
  },
  {
    "type": "cities",
    "name": "Bernay",
    "rent" : [8, 40, 100, 300, 450, 600],
    "buildCost": 50,
    "mortage": false,
    "cost": 120,
    "bg": "",
    "fg": "",
    "color": "light blue",
    "pos": 9
  },
  {
    "type": "cities",
    "name": "Pointe du Hoc",
    "rent" : [10, 50, 150, 450, 625, 750],
    "buildCost": 100,
    "mortage": false,
    "cost": 140,
    "bg": "",
    "fg": "",
    "color": "scarlet",
    "pos": 11
  },
  {
    "type": "cities",
    "name": "Fécamp",
    "rent" : [10, 50, 150, 450, 625, 750],
    "buildCost": 100,
    "mortage": false,
    "cost": 140,
    "bg": "",
    "fg": "",
    "color": "scarlet",
    "pos": 13
  },
  {
    "type": "cities",
    "name": "Lisieux",
    "rent" : [12, 60, 180, 500, 700, 900],
    "buildCost": 100,
    "mortage": false,
    "cost": 160,
    "bg": "",
    "fg": "",
    "color": "scarlet",
    "pos": 14
  },
  {
    "type": "cities",
    "name": "Le Bec-Hellouin",
    "rent" : [14, 70, 200, 550, 750, 950],
    "buildCost": 100,
    "mortage": false,
    "cost": 180,
    "bg": "",
    "fg": "",
    "color": "orange",
    "pos": 16
  },
  {
    "type": "cities",
    "name": "Forges-Les-Eaux",
    "rent" : [14, 70, 200, 550, 750, 950],
    "buildCost": 100,
    "mortage": false,
    "cost": 180,
    "bg": "",
    "fg": "",
    "color": "orange",
    "pos": 18
  },
  {
    "type": "cities",
    "name": "Villequier",
    "rent" : [16, 80, 220, 600, 800, 1000],
    "buildCost": 100,
    "mortage": false,
    "cost": 200,
    "bg": "",
    "fg": "",
    "color": "orange",
    "pos": 19
  },
  {
    "type": "cities",
    "name": "Lyons-La-Forêt",
    "rent" : [18, 90, 250, 700, 875, 1050],
    "buildCost": 150,
    "mortage": false,
    "cost": 220,
    "bg": "",
    "fg": "",
    "color": "red",
    "pos": 21
  },
  {
    "type": "cities",
    "name": "Le Havre",
    "rent" : [18, 90, 250, 700, 875, 1050],
    "buildCost": 150,
    "mortage": false,
    "cost": 220,
    "bg": "",
    "fg": "",
    "color": "red",
    "pos": 23
  },
  {
    "type": "cities",
    "name": "Dieppe",
    "rent" : [20, 100, 300, 750, 925, 1100],
    "buildCost": 150,
    "mortage": false,
    "cost": 220,
    "bg": "",
    "fg": "",
    "color": "red",
    "pos": 24
  },
  {
    "type": "cities",
    "name": "Bayeux",
    "rent" : [22, 110, 330, 800, 975, 1150],
    "buildCost": 150,
    "mortage": false,
    "cost": 260,
    "bg": "",
    "fg": "",
    "color": "yellow",
    "pos": 26
  },
  {
    "type": "cities",
    "name": "Gisors",
    "rent" : [22, 110, 330, 800, 975, 1150],
    "buildCost": 150,
    "mortage": false,
    "cost": 260,
    "bg": "",
    "fg": "",
    "color": "yellow",
    "pos": 27
  },
  {
    "type": "cities",
    "name": "Giverny",
    "rent" : [24, 120, 360, 850, 1025, 1200],
    "buildCost": 150,
    "mortage": false,
    "cost": 280,
    "bg": "",
    "fg": "",
    "color": "yellow",
    "pos": 29
  },
  {
    "type": "cities",
    "name": "Îles Chausey",
    "rent" : [26, 130, 390, 900, 1100, 1275],
    "buildCost": 200,
    "mortage": false,
    "cost": 300,
    "bg": "",
    "fg": "",
    "color": "lime",
    "pos": 31
  },
  {
    "type": "cities",
    "name": "Etretat",
    "rent" : [26, 130, 390, 900, 1100, 1275],
    "buildCost": 200,
    "mortage": false,
    "cost": 300,
    "bg": "",
    "fg": "",
    "color": "lime",
    "pos": 32
  },
  {
    "type": "cities",
    "name": "Honfleur",
    "rent" : [28, 150, 450, 1000, 1200, 1400],
    "buildCost": 200,
    "mortage": false,
    "cost": 320,
    "bg": "",
    "fg": "",
    "color": "lime",
    "pos": 34
  },
  {
    "type": "cities",
    "name": "Cabourg",
    "rent" : [35, 175, 500, 1100, 1300, 1500],
    "buildCost": 200,
    "mortage": false,
    "cost": 350,
    "bg": "",
    "fg": "",
    "color": "blue",
    "pos": 37
  },
  {
    "type": "cities",
    "name": "Deauville",
    "rent" : [50, 200, 600, 1400, 1700, 2000],
    "buildCost": 200,
    "mortage": false,
    "cost": 400,
    "bg": "",
    "fg": "",
    "color": "blue",
    "pos": 39
  },
  {
      "type": "action",
      "name": "caisse de communauté",
      "actionType": "community",  
      "action": companyCards,
      "bg": "",
      "fg": "",
      "pos": 2
    },
    {
      "type": "action",
      "name": "caisse de communauté",
      "actionType": "community",
      "action": companyCards,
      "bg": "",
      "fg": "",
      "pos": 17
    },
    {
      "type": "action",
      "name": "caisse de communauté",
      "actionType": "community",
      "action": companyCards,
      "bg": "",
      "fg": "",
      "pos": 33
    },
    {
      "type": "action",
      "name": "luck",
      "actionType": "luck",
      "action": luckCards,
      "bg": "",
      "fg": "",
      "pos": 7
    },
    {
      "type": "action",
      "name": "luck",
      "actionType": "luck",
      "action": luckCards,
      "bg": "",
      "fg": "",
      "pos": 22
    },
    {
      "type": "action",
      "name": "luck",
      "actionType": "luck",
      "action": luckCards,
      "bg": "",
      "fg": "",
      "pos": 36
    },
    {
      "type": "action",
      "name": "taxe",
      "actionType": "taxe",
      "description": "Taxe of luxury",
      "bg": "",
      "fg": "",
      "pos": 38
    },
    {
      "type": "action",
      "name": "impôts sur le revenu",
      "actionType": "taxe",
      "action": 200,
      "bg": "",
      "fg": "",
      "pos": 4
    },
    {
      "type": "companies",
      "name": "Gare de Rouen",
      "cost": 200,
      "multiplier": [0, 1, 2, 4, 8],
      "mortage": false,
      "bought": false,
      "bg": "",
      "fg": "",
      "pos": 5
    },
    {
      "type": "companies",
      "name": "Gare de Caen",
      "cost": 200,
      "multiplier": [0, 1, 2, 4, 8],
      "mortage": false,
      "bought": false,
      "bg": "",
      "fg": "",
      "pos": 15
    },
    {
      "type": "companies",
      "name": "Gare d'Evreux",
      "cost": 200,
      "multiplier": [0, 1, 2, 4, 8],
      "mortage": false,
      "bought": false,
      "bg": "",
      "fg": "",
      "pos": 25
    },
    {
      "type": "companies",
      "name": "Gare de Cherbourg",
      "cost": 200,
      "multiplier": [0, 1, 2, 4, 8],
      "mortage": false,
      "bought": false,
      "bg": "",
      "fg": "",
      "pos": 35
    },
    {
      "type": "companies",
      "name": "Compagnies d'électricité",
      "cost": 150,
      "multiplier": [1, 4, 10],
      "mortage": false,
      "bought": false,
      "bg": "",
      "fg": "",
      "pos": 12
    },
    {
      "type": "companies",
      "name": "Compagnies de distribution d'eau",
      "cost": 150,
      "multiplier": [1, 4, 10],
      "mortage": false,
      "bought": false,
      "bg": "",
      "fg": "",
      "pos": 28
    },
    {
      "type": "action",
      "name": "start",
      "actionType": "start",
      "description": "Receive a start amount of",
      "bg": "",
      "fg": "",
      "pos": 0
    },
    {
      "type": "prison",
      "name": "jail",
      "description": "Just pass or go Jail",
      "bg": "",
      "fg": "",
      "pos": 10
    },
    {
      "type": "action",
      "name": "Free parking",
      "description": "You can stay here for a turn",
      "bg": "",
      "fg": "",
      "pos": 20
    },
    {
      "type": "action",
      "name": "Go to prison",
      "actionType": "injail",
      "description": "You have to go to the prison !",
      "bg": "",
      "fg": "",
      "pos": 30
    }
];

export default{
    Cards_json
}