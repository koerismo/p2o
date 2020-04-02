# Formats

## Level formats

### PEA
> PEA (Portal Editor Abstract) is the format used by the level editor itself to store editable levels.
> It is composed of air space, items, and other things.
> See [levels](/levels.md) for more details.

### PEC
> PEC (Portal Editor Compiled) is like the PEA format, but with calculated solids that can be used by the styling script
> Faces in PEC are identified with a role and texture (e.g. white_wall,tile_white_2x2) to make it easier for styles to adjust textures
> The style can add additional solids and entities that will be converted alongside the originals.
> This file is not editable by P2O.

### VMF
> This is the the fully compiled level (note the wording) that can be read by hammer
> From here, it is converted to a BSP which can be read by the game.
> This file is not editable by P2O.

### Packages
> See [packages](/packages.md) section.
