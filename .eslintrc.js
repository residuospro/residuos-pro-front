module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		"plugin:vue/vue3-essential",
		"eslint:recommended",
		"@vue/typescript/recommended",
		"plugin:prettier/recommended",
	],
	parserOptions: {
		ecmaVersion: 2020,
	},
	plugins: ["@typescript-eslint", "prettier"],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

		"@typescript-eslint/no-explicit-any": "off",
		"vue/multi-word-component-names": [
			"error",
			{
				ignores: [
					"Button",
					"Container",
					"Typograph",
					"Input",
					"Acess",
					"Login",
					"Loading",
					"Painel",
					"Collections",
					"Users",
					"Departments",
					"Dashboard",
					"Settings",
					"DataTable",
					"Pagination",
					"Select",
					"DeleteModal",
					"Notification",
					"Sediments",
					"Wrapper",
					"Details",
					"Reports",
					"Chart",
					"DailyEntries",
					"Collection",
					"Logo",
				],
			},
		],
		"prettier/prettier": [
			"error",
			{
				endOfLine: "auto",
			},
		],
		"require-jsdoc": [
			"error",
			{
				require: {
					FunctionDeclaration: false,
					MethodDefinition: false,
					ClassDeclaration: false,
					ArrowFunctionExpression: false,
					FunctionExpression: false,
				},
			},
		],
		"no-undef": "off",
	},
}
