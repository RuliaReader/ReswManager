# F word to Resw

This is a tiny tool to manage the `resw` files in .net projects.

I hate managing resw.

## Usage

 - npm install
 - npm run dev

> You may see there is the command `npm run prod` which is meaningless in this case. It just inherited from the template.

## Env file

Please create a `.env` file:

```
HOST=0.0.0.0
PORT=3000
STRING_FOLDER_PATH=C:\SOME_PATH\TO\YOUR\STRING\FOLDER
```

`STRING_FOLDER_PATH` points to the `Strings` folder in your .NET project.

## Notice

This thing was poorly built. It was just designed for my UWP project and didn't have any further test.

Also there is a warning which says:

```
Module not found: Error: Can't resolve 'stream' in 'node_modules\sax\lib'
```

Never mind this. I am too tired to fix it. F**k JavaScript toolchain.
