## Related Issues

- 

## Premise

As we have grammar description and access to an assembly code even from AST,
I considered to use PEG-based parser to generate custom AST from assembly code,
then use adapter to make it compatible with current ASTReader processing logic.

## Changes

<!-- START pr-commits -->
<!-- END pr-commits -->

## Concerns

It appears that the compiler is trimming spaces and reducing indentation within assembly code strings in `Assembly` AST node.
This causes inability to generate proper `src` attributes for custom AST by simple math.
Also, this is not fixable, because these dependencies are already released and can not be patched.
Need to find another way to link `AssemblyIdentifier` to a top-level `VariableDeclaration` node.
I would appreciate any suggestions that will help in solving the situation.

## Notes

- This PR changes major package API, which would result in a backward compatibility (BC) break.

