defmodule ElixirScript.Experimental.Module do
  alias ESTree.Tools.Builder, as: J
  alias ElixirScript.Experimental.Function
  alias ElixirScript.Translator.Identifier
  alias ElixirScript.State, as: ModuleState

  @moduledoc """
  Upper level module that handles compilation
  """

  def compile(module, pid) do
    IO.inspect "Compiling #{inspect module}"
    info = case ElixirScript.Beam.debug_info(module) do
      {:ok, info} ->
        compile_module(module, info, pid)
      {:ok, module, implementations} ->
        compile_protocol(module, implementations, pid)
      {:error, error} ->
        raise "An error occurred while compiling #{inspect module}: #{error}"
    end
  end

  defp compile_module(module, info, pid) do
    %{
      attributes: _attrs, 
      compile_opts: _compile_opts,
      definitions: defs,
      file: _file,
      line: _line, 
      module: ^module, 
      unreachable: unreachable
    } = info

    state = %{
      pid: pid
    }
 
    reachable_defs = Enum.filter(defs, fn
      { name, _, _, _} -> not(name in unreachable)
      { _, type, _, _} when type in [:defmacro, :defmacrop] -> false
      _ -> true
    end)

    module_info = %{module: module, defs: defs}
    ModuleState.put_module(pid, module, module_info)

    compiled_functions = reachable_defs
    |> Enum.map(&Function.compile(&1, state))

    exports = make_exports(reachable_defs)

    js_ast = ElixirScript.ModuleSystems.Namespace.build(
      module,
      compiled_functions,
      exports,
      nil
    )

    ModuleState.put_module(pid, module, Map.put(module_info, :js_ast, hd(js_ast))) 
  end

  defp compile_protocol(module, implementations, pid) do
    ModuleState.put_module(pid, module, %{})

    Enum.each(implementations, fn({impl, info}) -> compile_module(impl, info, pid) end) 
  end

  defp make_exports(reachable_defs) do
    exports = Enum.reduce(reachable_defs, [], fn
      {{name, arity}, :def, _, _}, list ->
      function_name = ElixirScript.Translator.Identifier.make_function_name(name, arity)
        list ++ [J.property(function_name, function_name, :init, true)]
      _, list ->
        list
    end)

    J.object_expression(exports)
  end

  def is_elixir_module(Elixir) do
    true
  end

  def is_elixir_module(module) when is_atom(module) do
    str_module = Atom.to_string(module)

    case str_module do
      "Elixir." <> _ ->
        true
      _ ->
        false
    end
  end

  def is_elixir_module(_) do
    false
  end

  def is_js_module(module, state) do
    cond do
      module in ModuleState.get_javascript_modules(state.pid) ->
        true
      is_elixir_module(module) and hd(Module.split(module)) == "JS" ->
        true
      true ->
        false
    end
  end
end
