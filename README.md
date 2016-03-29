# POSHI

This extension is the support for POSHI in VS Code editor.

## Installation
In order to install an extension you need to launch the Command Pallete (Ctrl + Shift + P or Cmd + Shift + P) and type `Extensions`. There you have either the option to show the already installed snippets or install new ones.

**Becuase the extension is in progress now, so you can only install it by .vsix file, just drag and drop it to your editor.**

## Usagekw
![create new testcase](./images/demo1.gif)
![invoke macro with var](./images/demo2.gif)
![if-then-else style](./images/demo3.gif)

## Snippets(In Progress)

Below is a list of all available snippets and the triggers of each one. The **⇥** means the `TAB` key.

### Basic

| Trigger  | Content |
| -------: | ------- |
| **Common** |  |
| `pss` | index Syntax code pattern |
| `comd` | creates a command code block |
| `exe`| create a execute code block with no parameter |
| `vexe` | create a execute code block only with value1 parameter |
| `lexe` | create a execute code block only with locator1 parameter |
| `lvexe` | create a execute code block with locator1 and value1 parameters |
| `var` | create a var declaration code block |
| **Function** |  |
| `df` | create a definition code block for Function |
| `ins` | invoke selenium command |
| **Macro** |  |
| `dm` | create a definition code block for Macro |
| `inf` | invoke function command |
| `linf` | invoke function command only with locator1 parameter |
| `vinf` | invoke function command only with value1 parameter |
| `lvinf` | invoke function command with locator1 and value1 parameters |
| **Testcase** |  |
| `dt` | create a definition code block for Testcase |
| `comd` | create a command code block |
| `prop` | create a property declaration code block |
| `inm` | invoke Macro command |
| `vinm` | invoke Macro command with one var |
| `vsinm` | invoke Macro command with several vars |
| **Path** |  |
| `dp` | create a definition code block for Path locator |
| `dep` | create a definition code block for empty Path locator |


### Advance
| Trigger  | Content |
| -------: | ------- |
| **Condition & Loop** |  |
| `eq` | create `equals` condition cond segment |
| `cond` | create `condition` condition code segment |
| `ift` | create `if-then` condition code segment |
| `ifte` | create `if-then-else` condition code segment |
| `ifteif` | create `if-then-elseif` condition code segment |
| `eif` | create `else-if` condition code segment |
| `el` | create `else` condition code segment |
| `whth` | create `while-then` loop code segment| 
| `for` | create `for` loop code segment |

| **Others** |  |
| `svcomd` | declare a var and invoke function with it in Macro |




## Custom Snippets
You could also define your own snippets. You need to launch the Command Pallete (Ctrl + Shift + P or Cmd + Shift + P) and type `Preference Snippets`. Then you can override existed snippets or define your own snippets !!

## Inspiration
[reactjs snippets](https://github.com/xabikos/vscode-react)
[javascript snippets](https://github.com/xabikos/vscode-javascript)

**Enjoy!**