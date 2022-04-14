import service from "./service"

export const getUserList = async (
): Promise<string> => {
  try {
    const res = await service.get("https://gorest.co.in/public/v2/users")
    console.log(res?.data)
    if (res?.status === 200) {
      return res?.data ?? null
    }

    throw "error: " + res?.status + ": " + res?.data?.error?.message ?? ""
  } catch (error) {
    // ElMessage.error(i18n.global.t("admin.userManagement.geruserListError"))
  }
  return 'string'
}
