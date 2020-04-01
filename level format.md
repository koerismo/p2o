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
    {
      "x1":0,
      "y1":0,
      "z1":0,
      "x2":128,
      "y2":128,
      "z2":128,
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
      {
      "item":["example","Turret"],
      "x":0,
      "y":0,
      "z":0,
      "rot_x":0,
      "rot_y":0,
      "rot_z":0,
      "connections":[
        {
        "id":1,
        "type":"input", //input connections will not be considered while compiling. (they are used in the editor for optimization)
        "event:"On Pressed",
        "result":"Explode"
        }
      ]
    },
    {
      "item":["example","Floor Button"],
      "x":128,
      "y":0,
      "z":0,
      "rot_x":0,
      "rot_y":0,
      "rot_z":0,
      "connections":[
        {
        "id":0,
        "type":"output",
        "event:"On Pressed",
        "result":"Explode"
        }
      ]
    }
  ]
}
```
