import { collectionStore } from "./collectionStore"
import { audioStore } from "./audioStore"
import { companyStore } from "./companyStore"
import { departmentStore } from "./departmentStore"
import { sedimentStore } from "./sedimentStore"
import { userStore } from "./userStore"

export const stores = () => {
	const collection_store = collectionStore()
	const audio_store = audioStore()
	const company_store = companyStore()
	const department_store = departmentStore()
	const sediment_store = sedimentStore()
	const user_store = userStore()

	return {
		collection_store,
		audio_store,
		company_store,
		department_store,
		sediment_store,
		user_store,
	}
}
