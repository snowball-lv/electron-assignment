{
    "targets": [{
        "target_name": "conf",
        "sources": ["conf-addon/conf.cpp"],
        "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
        "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
        "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
    }]
}