# P2O Level Format
*this format may be subject to change throughout developement*

## Folder Structure
```
Levels
└───mylevel.json
```

## level.json
*sample code*
```javascript
{
  "Name":"test",
  "Blocks":[
    { //these are the inside chamber space
      "x":-128,
      "y":0,
      "z":0,
      "faces":{
        "-x":"My Texture",
        "+x":"My Texture",
        "-y":"My Texture",
        "+y":"My Texture",
        "-z":"My Texture",
        "+z":"My Texture"
      },
      "scale":128
    },
    {
      "x":0,
      "y":0,
      "z":0,
      "faces":{
        "-x":"My Texture",
        "+x":"My Texture",
        "-y":"My Texture",
        "+y":"My Texture",
        "-z":"My Texture",
        "+z":"My Texture"
      },
      "scale":128
    },
    {
      "x":128,
      "y":0,
      "z":0,
      "faces":{
        "-x":"My Texture",
        "+x":"My Texture",
        "-y":"My Texture",
        "+y":"My Texture",
        "-z":"My Texture",
        "+z":"My Texture"
      },
      "scale":128
    }
  ],
  "Entities":[
      { //this item is id 0
      "item":["example","Turret"],
      "x":-128,
      "y":0,
      "z":0,
      "rot_x":0,
      "rot_y":0,
      "rot_z":0
      },
      { //this item is id 1
      "item":["example","Floor Button"],
      "x":0,
      "y":0,
      "z":0,
      "rot_x":0,
      "rot_y":0,
      "rot_z":0,
      "itemOutputs":{
        0:[ // item 0
          {"event":"On Pressed","output":"Explode"}
        ],
        2:[
          {"event":"On UnPressed","output":"Explode"}
        ]
      }
    },
    { //this item is id 2
    "item":["example","Turret"],
    "x":128,
    "y":0,
    "z":0,
    "rot_x":0,
    "rot_y":0,
    "rot_z":0
    }
  ]
}
```
