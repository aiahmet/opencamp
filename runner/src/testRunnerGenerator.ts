import { JavaTestSuite } from "./types";

export function generateTestRunner(testSuite: JavaTestSuite): string {
  const { method, tests } = testSuite;

  let code = "import java.io.*;\n\n";
  code += "public class TestRunner {\n";
  code += "  public static void main(String[] args) throws Exception {\n";
  code += "    StringBuilder builder = new StringBuilder();\n";
  code += '    builder.append("{\"tests\":[");\n';

  for (let idx = 0; idx < tests.length; idx++) {
    const test = tests[idx];
    if (!test) continue;
    if (idx > 0) {
      code += ",";
    }

    const inputStr = test.input.map((val) => {
      if (typeof val === "string") {
        return `"${val.replace(/"/g, '\\"')}"`;
      }
      return String(val);
    }).join(", ");

    const expectedStr = JSON.stringify(test.output);
    const idxNum = idx + 1;

    code += `\n    // Test case ${idxNum}\n`;
    code += "    try {\n";
    code += `      int result_${idx} = Solution.${method}(${inputStr});\n`;
    code += `      int expected_${idx} = ${expectedStr};\n`;
    code += `      boolean passed_${idx} = (result_${idx} == expected_${idx});\n`;
    code += `      builder.append("{\\"name\\":\\"case ${idxNum}\\",\\"passed\\":");\n`;
    code += `      builder.append(",\\"expected\\":").append(expected_${idx});\n`;
    code += `      builder.append(",\\"actual\\":").append(result_${idx});\n`;
    code += `      if (!passed_${idx}) {\n`;
    code += '        builder.append(",\\"stderr\\":\\"Failed: expected ").append(expected_${idx}).append(" but got ").append(result_${idx}).append("\\");\n';
    code += "      }\n";
    code += '      builder.append("}");\n';
    code += "    } catch (Exception e) {\n";
    code += "      String errorMsg = e.getMessage();\n";
    code += `      builder.append("{\\"name\\":\\"case ${idxNum}\\",\\"passed\\":false,\\"expected\\":\\"").append(${expectedStr}).append("\\",\\"actual\\":\\"error\\",\\"stderr\\":\\"Exception: \\" + errorMsg + "\\\"}");\n`;
    code += "    }\n";
  }

  code += "\n";
  code += '    builder.append("],\\"passed\\":true}");\n';
  code += "    System.out.println(builder.toString());\n";
  code += "  }\n";
  code += "}\n";

  return code;
}
