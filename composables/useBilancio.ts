export const useBilancio = () => {
  const ceData = ref<any>(null)
  const spData = ref<any>(null)
  const cfData = ref<any>(null)
  const kpiData = ref<any>(null)
  const cagr = ref<number | null>(null)

  const loading = reactive({ ce: false, sp: false, cf: false, kpi: false })
  const error = reactive<{ ce: any; sp: any; cf: any; kpi: any }>({ ce: null, sp: null, cf: null, kpi: null })

  const fetchCE = async () => {
    loading.ce = true
    error.ce = null
    try {
      const res = await $fetch<any>('/api/bilancio/conto-economico')
      if (res.success) ceData.value = res.data
    } catch (e) {
      error.ce = e
    } finally {
      loading.ce = false
    }
  }

  const fetchSP = async () => {
    loading.sp = true
    error.sp = null
    try {
      const res = await $fetch<any>('/api/bilancio/stato-patrimoniale')
      if (res.success) spData.value = res.data
    } catch (e) {
      error.sp = e
    } finally {
      loading.sp = false
    }
  }

  const fetchCF = async () => {
    loading.cf = true
    error.cf = null
    try {
      const res = await $fetch<any>('/api/bilancio/cash-flow')
      if (res.success) cfData.value = res.data
    } catch (e) {
      error.cf = e
    } finally {
      loading.cf = false
    }
  }

  const fetchKPI = async () => {
    loading.kpi = true
    error.kpi = null
    try {
      const res = await $fetch<any>('/api/bilancio/kpi')
      if (res.success) {
        kpiData.value = res.data
        cagr.value = res.cagr ?? null
      }
    } catch (e) {
      error.kpi = e
    } finally {
      loading.kpi = false
    }
  }

  return {
    ceData, spData, cfData, kpiData, cagr,
    loading, error,
    fetchCE, fetchSP, fetchCF, fetchKPI,
  }
}
