# CalcJSON

## <a name="copyright"></a>Copyright

Copyright (c) 2013 Andrew Berkeley.

<https://github.com/spatchcock/calcJSON>

## <a name="abstract"></a>Abstract

CalcJSON is a data protocol suitable for the description and exchange of calculation algorithms, particularly those associated with datasets.

The inspiration for this data format was the field of greenhouse gas emissions calculations which commonly involve calculations using an associated dataset of possible input values (e.g. fuel properties). At its core, however, the protocol enables the specification of a collection of model components and one or more algorithms which relate them with one another. It is therefore possible to describe generalised calculations without associated data.

The protocol provides a standard method for describing model components (including type, default values and units), associated data, metadata and algorithms.

## <a name="license"></a>License

The CalcJSON standard is licensed under a [GNU AFFERO GENERAL PUBLIC LICENSE](http://www.gnu.org/licenses).

## <a name="toc"></a>Table of Contents

* [Copyright](#copyright)
* [Abstract](#abstract)
* [License](#license)
* [Table of Contents](#toc)
* [Goals of calcJSON](#goals)
* [The calcJSON data Format](#data_format)
  * [Data Format Description](#description)
  * [Fields](#fields)
  * [Algorithms](#algorithms)
  * [Data](#data)
  * [Metadata](#metadata)
* [Examples](#examples)
* [To do](#todo)
* [References](#references)
* [Appendix](#appendix)
  * [Revision History](#history)
  * [Contributing to CalcJSON](#contribute)
  * [Contributors](#contributors)

## <a name="goals"></a>Goals of CalcJSON

The CalcJSON data format has been developed with the following goals in mind:

* To be suitable for the description and exchange of calculation methodologies and models.;
* To support the bundling of model-associated data;
* To be human- and computer-readable and self-documenting;
* To be easy to use and widely supported;
* To be compatible with existing protocols;

To this end:

* The data format uses and extends the [JSON Table Schema](http://www.dataprotocols.org/en/latest/json-table-schema.html) data protocol and is compatible with the [Data Package Protocol](http://www.dataprotocols.org/en/latest/data-packages.html).
* The data format uses JSON encoding [\[1\]](#1). This ensures that CalcJSON is able to be widely supported, and that the data format balances the need to be human and computer readable.
* The data format uses Javascript for describing algorithms. There are at least 3 reasons for this:
  * Javascript is an interpretted, scripting language, and therefore has a relatively simple syntax (e.g. dynamic typing). This means that algorithms can be codified in a relatively human-readable way.
  * Javascript is the *lingua franca* of the web and other such cliches. Bascially, most people know some Javascript.
  * Javascript... supports JSON (pretty well!).

## <a name="data_format"></a>The CalcJSON Data Format

The the full CalcJSON data format is shown below. A [full description of the format](#description) follows, along with [examples](#examples) of realistic CalcJSON formatted data.

    {
      # A list of 'field' descriptions, each representing a single component of the model
      # Follows and extends the [JSON Table Schema](http://www.dataprotocols.org/en/latest/json-table-schema.html) data protocol
      "fields": [
        # A field description
        {
          "id": required string. 
          "label":required string,
          "type": required string, either "string","number","integer", or "boolean",
          "role": required string, either "descriptor", "parameter", "variable" or "output",
          "description": optional string,
          "unit": optional string,
          "default": string, number, integer or boolean, following the type defined in the "type" attribute. Optional,
          "choices": [ optional array of accepted values, each following the type defined in the "type" attribute ],
        },
        ... more field descriptions
      ],
      # A list of associated algorithms
      # Can be omitted if algorithm(s) specified in separate .js file(s)
      "algorithms": [
        # An algorithm description
        {
          "id": required string,
          "script": required string
        }
      ],
      # An optional 'table' of data, following the [JSON Table Schema](http://www.dataprotocols.org/en/latest/json-table-schema.html) data protocol
      "data": [
        # A data record. Field ids follow those specified in the "fields" object
        {
          field id: value, field id: value,
        },
        ...more data records
      ],
      # Optional metadata object following the [Data Package Protocol](http://www.dataprotocols.org/en/latest/data-packages.html).
      # This block and some elements within it are required if specifying algorithms in separate .js files
      # This block can be specified in a separate datapackage.json file for compatibility with the Data Package Protocol
      "metadata": {
        "name": optional string,
        "title": optional string,
        "description": optional string,
        "version": optional string,
        "licenses": [
          {
            "id": optional string,
            "url": optional string
          }
        ],
        "sources": [
          {
            "name":,
            "web":,
            "email":
          }
        ],
        "keywords": [],
        "last_updated":,
        "image":,
        "maintainers": [],
        "contributors": [
          {
            "name": ,
            "email": ,
            "web": 
          }
        ],
        "publisher": [
          {
            "name": ,
            "email": ,
            "web": 
          }
        ],
        "files": [
          {
            "url": string. Required if path is not specified,
            "path": string. Required if url is not specified,
            "dialect": optional string,
            "schema" optional string:
          }
        ]
      }
    }


### <a name="description"></a>Data Format Description

The CalcJSON data format describes a collection of model components (e.g. inputs, outputs) together with the algorithm(s) that relate them with one-another. Optionally, associated data and metadata can be specified. This information is described in a JSON encoded [\[1\]](#1) string with structure as shown above with some flexibility for specifying algorithms separately.

The CalcJSON data format consists of four main sections:

* **fields**: The "fields" section is used to describe the individual components of the calculation methodology/model;
* **algorithms**: The "algorithms" section is used to codify the calculation(s) which are associated with the model. This section is used only when algorithms are described inline. An alternative approach is to define algorithms using separate .js files.
* **data**: The optional "data" section is used for representing tabular data which can be used in conjunction with the model.
* **metadata**: The "metadata" section is optional (unless multiple files are used) but can be used to describe non-functional data regarding the model.

### <a name="fields"></a>Fields

In the CalcJSON data format, the "fields" section is used to describe the properties of indivdual model components. This approach is analogous to a table schema, and indeed, the specification herein follows and extends the [Data Package Protocol](http://www.dataprotocols.org/en/latest/data-packages.html) data format of dataprotocols.org. While these fields can be thought of as analogous to table columns, the extended specification provided here defines 'output' components - that is, the outputs of model calculations. In this sense it is perhaps useful to think of tables defined within spreadsheets where some columns represent user inputs and others the outputs of formulas.

The "fields" section must be an array of objects which each contain some of the following keys.

* **id**: Required. A unique machine readable name for the model component. This should use only alpha-numeric characters in addition to "_" and "-".
* **label**: Required. A human readable name for the model component.
* **type**: Required. The type of data represented by this model component. In principle this field should support all of the types specified by the [Data Package Protocol](http://www.dataprotocols.org/en/latest/data-packages.html) data protocol, which extends the type set of JSON. The types most commonly application to calculation algorithms are probably "string", "number" (floating point), "integer" and "boolean".
* **role**: Required. The "role" field specifies the role that this model component plays within calculations. Valid values are as follows:
  * **variable**: One of two types of model component which represent *inputs* to a calculation. Variables are intended to represent inputs which vary on a case-by-case basis and would typical require a user input.
  * **parameter**: The other type of calculation *input*, parameters represent data which is potentially fixed across calculations, e.g. constants. The practical implication of this as far as CalcJSON is concerned is that 'parameters' would be typically used to represent the calculation inputs which are represented within any associated 'tabular' data (see the "data" section). In this sense 'parameters' represent the data bundled with the model, in contrast to 'variables' which are always specified on the fly.
  * **output**: Output components represent the outputs of calculation algorithms.
  * **descriptor**: Descriptor components usually play no role in calculations but instead provide a descriptive context for a data record. Therefore, descriptor components are only really meaningful where a model does specified associated tabular data. In this case each data record (table 'row') may have one or more descriptor fields ('columns') which describe the context of the other data within the same record.
* **description**: Optional. More verbose notes or annotations related to the model component.
* **unit**: Optional. Specfies the physical unit for the component. 
* **default**: Optional. Specifies a default value for the component.
* **choices**: Optional. An array which contains a list of acceptable values for the component.

### <a name="algorithms"></a>Algorithms
The "algorithms" section represents one of two ways to declare the algorithm(s) which are included within the model. When using the "algorithms" object, it should represent an array of sub-objects each describing a separate algorithm and containing the following fields:

* **id**: Required. A unique identifier for the algorithm. This should use only alpha-numeric characters in addition to "_" and "-".
* **script**: Required. A string containing the raw javascript describing the algorithm. Care should be taken when using this approach since JSON does not support real line-breaks. This usage would be ideal for exchanging models using minified javascript, although this detracts from the human-readable goal of CalcJSON. Therefore, providing inline algorithms within CalcJSON is most appropriate when describing small and simple algorithms.

The alternative to specifying algorithms inline, is to provide algorithms using separate .js files. In this case, the filename without the .js extention is equivalent to the algorithm unique "id" field, and the file contents is equivalent to the "script" field.

#### Authoring algorithms
Algorithms should be written to the following specifications:

* Model components should be referenced using their "id" attribute
* Model outputs should have their values explicitly set

### <a name="data"></a>Data
A table of data associated with the calculation model can be specified using the "data" key. The structure of this data follows the [JSON Table Schema](http://www.dataprotocols.org/en/latest/json-table-schema.html) data protocol, taking to the format of an array of data records each comprising key/value pairs. Keys should correspond to ids defined in the "fields" sections, and should be limited to those defined as "descriptor" or "parameter".

### <a name="metadata"></a>Metadata

## <a name="example"></a>Examples

## <a name="todo"></a>To do
* Support historical/time-series data
* Support metadata on individual data records
* Unit specification protocol

## <a name="references"></a>References

1. <http://json.org/> <a name="1"></a>

## <a name="appendix"></a>Appendix

### <a name="history"></a>Revision History

* Version 0.0.2:
  * Updated metadata to be compatible with dataprotocols.org Data Package Protocol.
  * Updated fields to be compatible with dataprotocols.org JSON Table Schema.
  * Add inline algorithm declarations.
  * Change 'context' role to be name 'descriptor'.
* Version 0.0.1:
  * Initial version created.

### <a name="contribute"></a>Contributing to CalcJSON

Contributions to the CalcJSON data format are welcome! If you would like to participate you can:
  
* Send the author a message (andrew.berkeley.is@googlemail.com)
* Create an issue
* Fork the project and submit a pull request.

### <a name="contributors"></a>Contributors

* Andrew Berkeley <andrew.berkeley.is@googlemail.com>
* James Smith
