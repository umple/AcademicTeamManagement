import os

def get_redirection_url_for_user(user_role: str):

    if user_role == "student":
        redirect_url = "%s/StudentHome"%(os.getenv("BACKEND_HOST"))
    elif user_role == "professor":
        redirect_url = "%s/"%(os.getenv("BACKEND_HOST"))
    else:
        redirect_url = "%s/NotFound"%(os.getenv("BACKEND_HOST")) # not implemented yet
        
    return redirect_url