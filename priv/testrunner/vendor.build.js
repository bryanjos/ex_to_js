function unwrapExports(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a["default"]:a}function createCommonjsModule(a,b){return b={exports:{}},a(b,b.exports),b.exports}var tuple=createCommonjsModule(function(a,b){Object.defineProperty(b,"__esModule",{value:!0});class Tuple{constructor(...a){this.values=Object.freeze(a),this.length=this.values.length}get(a){return this.values[a]}count(){return this.values.length}[Symbol.iterator](){return this.values[Symbol.iterator]()}toString(){let a,b="";for(a=0;a<this.values.length;a++){""!==b&&(b+=", ");const c=this.values[a]?this.values[a].toString():"";b+=c}return"{"+b+"}"}put_elem(a,b){if(a===this.length){let a=this.values.concat([b]);return new Tuple(...a)}let c=this.values.concat([]);return c.splice(a,0,b),new Tuple(...c)}remove_elem(a){let b=this.values.concat([]);return b.splice(a,1),new Tuple(...b)}}b.Tuple=Tuple});unwrapExports(tuple);var tuple_1=tuple.Tuple,pid=createCommonjsModule(function(a,b){Object.defineProperty(b,"__esModule",{value:!0});let c=-1;b.PID=class PID{constructor(){++c,this.id=c}toString(){return"PID#<0."+this.id+".0>"}}});unwrapExports(pid);var pid_1=pid.PID,reference=createCommonjsModule(function(a,b){Object.defineProperty(b,"__esModule",{value:!0});let c=-1;b.Reference=class Reference{constructor(){++c,this.id=c,this.ref=Symbol()}toString(){return"Ref#<0.0.0."+this.id+">"}}});unwrapExports(reference);var reference_1=reference.Reference,bit_string=createCommonjsModule(function(a,b){Object.defineProperty(b,"__esModule",{value:!0});class BitString{constructor(...a){this.value=Object.freeze(this.process(a)),this.length=this.value.length,this.bit_size=8*this.length,this.byte_size=this.length}get(a){return this.value[a]}count(){return this.value.length}slice(a,b=void 0){let c=this.value.slice(a,b),d=c.map(a=>BitString.integer(a));return new BitString(...d)}[Symbol.iterator](){return this.value[Symbol.iterator]()}toString(){var a,b="";for(a=0;a<this.count();a++)""!==b&&(b+=", "),b+=this.get(a).toString();return"<<"+b+">>"}process(a){let b=[];var c;for(c=0;c<a.length;c++){const d="process_"+a[c].type;let e=this[d](a[c]);for(let b of a[c].attributes){e=this["process_"+b](e)}b=b.concat(e)}return b}process_integer(a){return a.value}process_float(a){if(64===a.size)return BitString.float64ToBytes(a.value);if(32===a.size)return BitString.float32ToBytes(a.value);throw new Error("Invalid size for float")}process_bitstring(a){return a.value.value}process_binary(a){return BitString.toUTF8Array(a.value)}process_utf8(a){return BitString.toUTF8Array(a.value)}process_utf16(a){return BitString.toUTF16Array(a.value)}process_utf32(a){return BitString.toUTF32Array(a.value)}process_signed(a){return new Uint8Array([a])[0]}process_unsigned(a){return a}process_native(a){return a}process_big(a){return a}process_little(a){return a.reverse()}process_size(a){return a}process_unit(a){return a}static integer(a){return BitString.wrap(a,{type:"integer",unit:1,size:8})}static float(a){return BitString.wrap(a,{type:"float",unit:1,size:64})}static bitstring(a){return BitString.wrap(a,{type:"bitstring",unit:1,size:a.bit_size})}static bits(a){return BitString.bitstring(a)}static binary(a){return BitString.wrap(a,{type:"binary",unit:8,size:a.length})}static bytes(a){return BitString.binary(a)}static utf8(a){return BitString.wrap(a,{type:"utf8",unit:1,size:a.length})}static utf16(a){return BitString.wrap(a,{type:"utf16",unit:1,size:2*a.length})}static utf32(a){return BitString.wrap(a,{type:"utf32",unit:1,size:4*a.length})}static signed(a){return BitString.wrap(a,{},"signed")}static unsigned(a){return BitString.wrap(a,{},"unsigned")}static native(a){return BitString.wrap(a,{},"native")}static big(a){return BitString.wrap(a,{},"big")}static little(a){return BitString.wrap(a,{},"little")}static size(a,b){return BitString.wrap(a,{size:b})}static unit(a,b){return BitString.wrap(a,{unit:b})}static wrap(a,b,c=null){let d=a;return a instanceof Object||(d={value:a,attributes:[]}),d=Object.assign(d,b),c&&d.attributes.push(c),d}static toUTF8Array(a){for(var b,c=[],d=0;d<a.length;d++)b=a.charCodeAt(d),128>b?c.push(b):2048>b?c.push(192|b>>6,128|63&b):55296>b||57344<=b?c.push(224|b>>12,128|63&b>>6,128|63&b):(d++,b=65536+((1023&b)<<10|1023&a.charCodeAt(d)),c.push(240|b>>18,128|63&b>>12,128|63&b>>6,128|63&b));return c}static toUTF16Array(a){for(var b,c=[],d=0;d<a.length;d++)b=a.codePointAt(d),b&&(255>=b?(c.push(0),c.push(b)):(c.push(255&b>>8),c.push(255&b)));return c}static toUTF32Array(a){for(var b,c=[],d=0;d<a.length;d++)b=a.codePointAt(d),b&&(255>=b?(c.push(0),c.push(0),c.push(0),c.push(b)):(c.push(0),c.push(0),c.push(255&b>>8),c.push(255&b)));return c}//http://stackoverflow.com/questions/2003493/javascript-float-from-to-bits
static float32ToBytes(a){var b=[],c=new ArrayBuffer(4);new Float32Array(c)[0]=a;let d=new Uint32Array(c)[0];return b.push(255&d>>24),b.push(255&d>>16),b.push(255&d>>8),b.push(255&d),b}static float64ToBytes(a){var b=[],c=new ArrayBuffer(8);new Float64Array(c)[0]=a;var d=new Uint32Array(c)[0],e=new Uint32Array(c)[1];return b.push(255&e>>24),b.push(255&e>>16),b.push(255&e>>8),b.push(255&e),b.push(255&d>>24),b.push(255&d>>16),b.push(255&d>>8),b.push(255&d),b}}b.BitString=BitString});unwrapExports(bit_string);var bit_string_1=bit_string.BitString,lib=createCommonjsModule(function(a,b){Object.defineProperty(b,"__esModule",{value:!0}),b.Tuple=tuple.Tuple,b.PID=pid.PID,b.Reference=reference.Reference,b.BitString=bit_string.BitString}),ErlangTypes=unwrapExports(lib),lib_1=lib.Tuple,lib_2=lib.PID,lib_3=lib.Reference,lib_4=lib.BitString,vendor={ErlangTypes};export default vendor;
