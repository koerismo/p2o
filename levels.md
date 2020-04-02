# P2O Level Format
*this format may be subject to change throughout developement*

## Folder Structure
```
Levels
└───mylevel.pea
```

## level.pea
*sample code*
```javascript
{
  "Name":"My Test",
  "Blocks":[
    {
      "x":-128,
      "y":0,
      "z":0,
      "faces":[ //these are roles not textures (see more in formats section)
        "white",
        "white", //roles converted to white_wall, white_ceil, or white_floor when compiled to PEC
        "white",
        "white",
        "white",
        "white"
      ],
      "scale":128
    },
    {
      "x":0,
      "y":0,
      "z":0,
      "faces":[
        "white",
        "white",
        "white",
        "white",
        "white",
        "white"
      ],
      "scale":128
    },
    {
      "x":128,
      "y":0,
      "z":0,
      "faces":[
        "white",
        "white",
        "white",
        "white",
        "white",
        "white"
      ],
      "scale":128
    }
  ],
  "Entities":[
      {
      "item":["example","Turret"],
      "x":-128,
      "y":0,
      "z":0,
      "rot_x":0,
      "rot_y":0,
      "rot_z":0
      },
      {
      "item":["example","Floor Button"],
      "x":0,
      "y":0,
      "z":0,
      "rot_x":0,
      "rot_y":0,
      "rot_z":0,
      "itemOutputs":{
        0:[
          {"event":"On Pressed","output":"Explode"}
        ],
        2:[
          {"event":"On UnPressed","output":"Explode"}
        ]
      }
    },
    {
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
