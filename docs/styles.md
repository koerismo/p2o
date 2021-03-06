# Making Styles
Styles are achieved through a script that runs before the vmf is compiled.
The script can modify any geometry and entity as well as adding additional geometry and entities.
Styles can also replace the internal PEC compiler if the wall generation does not suite the style well.

### Style Functions
the `stylePEA` function will be called on compile, and if it fails or does not exist it will default to the standard compiler. If this is the case, the `stylePEC` function will be called after the PEC compiler has finished.
**Note: styles have been modified to run through node.js. This means that these style functions must begin with `exports.`

### Style Variables
*Note: not implemented yet*
Style scripts should contain the variable `exports.appearance`. This variable dictates the textures that the editor should use for the walls, ceiling, and floor of the chamber as well as fog.

### Face Roles
The PEA format contains only the roles of each face. (see [roles](/docs/roles.md)) The internal PEC compiler will transfer these roles (and convert them to ..._floor, ..._ceil, ..._wall) to the sides of the generated walls as well as a randomly generated clean texture pertaining to the role. Roles exist to make it easier for the style/compiler to easily know what is what without checking each texture against a list. If your style runs through PEA, you will have to calculate these faces yourself.
