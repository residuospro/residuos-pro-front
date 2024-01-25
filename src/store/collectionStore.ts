import { ICollectionState, IFilterSelected } from "@/utils/interfaces"
import { defineStore } from "pinia"

export const collectionStore = defineStore("collectionStore", {
	state: (): ICollectionState => ({
		collectionDataForFilter: {
			orderNumber: "",
			sedimentName: null,
			department: null,
			status: null,
			date: "",
			idDepartment: undefined,
		},

		showClearFilterButton: false,
	}),

	getters: {
		getCollectionDataForFilter(state) {
			return state.collectionDataForFilter
		},

		getShowClearFilterButton(state) {
			return state.showClearFilterButton
		},
	},
	actions: {
		setCollectionDataForFilter(filter: IFilterSelected) {
			this.collectionDataForFilter = { ...filter }
		},

		setShowClearFilterButton(isSelected: boolean) {
			this.showClearFilterButton = isSelected
		},
	},
})
