#include <fstream>
#include <sstream>
#include <iostream>
#include <napi.h>

// XXX: should validate params and results in a real scenario

static std::string readFile(const std::string &path) {
    std::ifstream file(path);
    if (!file) return "";
    std::stringstream buf;
    buf << file.rdbuf();
    return buf.str();
}

static void writeFile(const std::string &path, const std::string &str) {
    std::ofstream file(path);
    file << str;
}

static Napi::Object readJsonObj(Napi::Env &env, const std::string &path) {
    auto confstr = Napi::String::New(env, readFile(path));
    if (confstr.empty()) confstr = "{}";
    auto json = env.Global().Get("JSON").As<Napi::Object>();
    auto json_parse = json.Get("parse").As<Napi::Function>();
    auto obj = json_parse.Call(json, {confstr}).As<Napi::Object>();
    return obj;
}

static void writeJsonObj(Napi::Env &env, const std::string &path, const Napi::Object &obj) {
    auto json = env.Global().Get("JSON").As<Napi::Object>();
    auto json_stringify = json.Get("stringify").As<Napi::Function>();
    auto str = json_stringify.Call(json, {
                obj, env.Null(), Napi::Number::New(env, 4)
            }).As<Napi::String>().Utf8Value();
    writeFile(path, str);
}

static Napi::Number readCounter(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    const std::string path = info[0].As<Napi::String>().Utf8Value();
    auto obj = readJsonObj(env, path);
    auto val = obj.Get("counterStartingPoint");
    return val.IsNumber() ? val.As<Napi::Number>()
            : Napi::Number::New(env, 0);
}

static void writeCounter(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    const std::string path = info[0].As<Napi::String>().Utf8Value();
    const auto counter = info[1].As<Napi::Number>();
    auto obj = readJsonObj(env, path);
    obj.Set("counterStartingPoint", counter);
    writeJsonObj(env, path, obj);
}

static Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    exports.Set( Napi::String::New(env, "readCounter"),
            Napi::Function::New(env, readCounter));
    exports.Set( Napi::String::New(env, "writeCounter"),
            Napi::Function::New(env, writeCounter));
    return exports;
}

NODE_API_MODULE(addon, InitAll)
