defmodule ElixirScript.Translate.Forms.Struct do
  alias ESTree.Tools.Builder, as: J
  alias ElixirScript.Translate.Form
  alias ElixirScript.Translator.Identifier

  def compile({:%, _, [module, params]}, state) do
    ast = J.call_expression(
      J.member_expression(
        process_module_name(module),
        J.identifier("__struct__1")
      ),
      [Form.compile!(params, state)]
    )

    { ast, state }
  end

  defp process_module_name(module) do
    members = ["Elixir"] ++ Module.split(module)
    Identifier.make_namespace_members(members)
  end
end
