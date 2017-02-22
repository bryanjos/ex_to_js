defmodule ElixirScript.ModuleSystems.Namespace do
  @moduledoc false
  alias ESTree.Tools.Builder, as: JS
  alias ElixirScript.Translator
  alias ElixirScript.Translator.State
  alias ElixirScript.Translator.Utils

  def build(module_name, imports, body, exports, env) do
    module_imports = Enum.map(imports, fn {module, path} ->
      import_module(module, env)
    end)

    List.wrap(make_namespace_body(module_name, module_imports, body, exports))
  end

  defp import_module(module_name, env) do
    name = ["Elixir" | Module.split(module_name) ] |> Enum.join("$")

    declarator = JS.variable_declarator(
      JS.identifier(name),
      JS.call_expression(
        JS.member_expression(
          JS.call_expression(
                    JS.member_expression(
                      JS.identifier(:Elixir),
                      JS.member_expression(
                        JS.identifier(:Core),
                        JS.member_expression(
                          JS.identifier(:Functions),
                          JS.identifier(:build_namespace)
                        )
                      )
                    ),
                    [JS.identifier("Elixir"), JS.literal(Utils.name_to_js_file_name(module_name))]
                  ),
         JS.identifier("__make")
        ),
        []
      )
    )

    JS.variable_declaration([declarator], :const)
  end

  defp make_namespace_body(module_name, imports, body, exports) do
    exports = if is_nil(exports), do: [], else: [JS.return_statement(exports)]

    make = JS.member_expression(
          JS.call_expression(
                    JS.member_expression(
                      JS.identifier(:Elixir),
                      JS.member_expression(
                        JS.identifier(:Core),
                        JS.member_expression(
                          JS.identifier(:Functions),
                          JS.identifier(:build_namespace)
                        )
                      )
                    ),
                    [JS.identifier("Elixir"), JS.literal(Utils.name_to_js_file_name(module_name))]
                  ),
                  JS.identifier("__make")
    )

    func_body = JS.block_statement(imports ++ body ++ exports)

    func = JS.function_expression([JS.identifier("Elixir")], [], func_body)
    JS.assignment_expression(
      :=,
      make,
      func
    )
  end
end