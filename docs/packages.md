# P2O Package Format
*this format may be subject to change throughout developement*

*For information on making styles, see [styles](/docs/styles.md)*

## Folder Structure
```
Packages
└───Package Name
    │   package.json
    ├───editor
    │   ├───icons
    │   ├───materials
    │   ├───models
    │   ├───scripts
    │   └───sounds
    └───ingame
        ├───instances
        ├───materials
        ├───models
        └───sounds
```

## package.json
*sample code*
```javascript
//this should be a json file, but it will be js here so I can comment
{
  "items":{
    "Turret":{ // this should be what you want the item to be named
      "name":"Turret", //same as above
      "description":"A thing that shoots players.",
      "icon":"turret.png"; // packagename/editor/icons/turret.png
      "instance":"turret.vmf", // packagename/ingame/instances.turret.vmf
      "itemInputs":{
        "Explode":{
          "type":"event", // see inputs/outputs section for list of types
          "input":"instance:turret;SelfDestructImmediately"
        }
      },
      "itemOutputs":{
      },
      "spawnRelay":"NULL", // if an entity is here, it will be triggered on level start
      "entranceRelay":"NULL", // triggered when the player enters the room
      "exitRelay":"NULL", // triggered when the player leaves the room
    },
    "Floor Button":{
      "name":"Floor Button",
      "description":"A button that is on the floor.",
      "icon":"button.png";
      "instance":"button.vmf",
      "itemInputs":{
      },
      "itemOutputs":{
        "On Pressed":{
          "type":"event",
          "output":"instance:floor_button;OnPressed"
        },
        "On UnPressed":{
          "type":"event",
          "output":"instance:floor_button;OnUnPressed"
        }
      },
      "spawnRelay":"NULL",
      "entranceRelay":"NULL",
      "exitRelay":"NULL",
    }
  },
  "materials":{
    "Rainbow":{
      "editoricon":"rainbow.png",
      "vtf":"rainbow.vtf" // packagename/ingame/materials/rainbow.vtf
    }
  },
  "styles":{
    "My Style":{
        "icon":"styleicon.png",
        "description":"This is an example!",
        "script":"myStyle.js"
    }
  }
}
```
## Inputs/Outputs
Input/Output types
| Type | Arguments |
| - | - |
| event | None |
| number | min,max |
| boolean | None |
