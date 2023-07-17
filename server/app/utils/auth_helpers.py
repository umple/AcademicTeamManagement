import os

def get_redirection_url_for_user(user_role: str):

    if user_role == "student":
        redirect_url = "%s:%s/StudentHome"%(os.getenv("BACKEND_HOST") , os.getenv("REACT"))
    elif user_role == "professor":
        redirect_url = "%s:%s/"%(os.getenv("BACKEND_HOST") , os.getenv("REACT"))
    else:
        redirect_url = "%s:%s/NotFound"%(os.getenv("BACKEND_HOST") , os.getenv("REACT")) # not implemented yet
        
    return redirect_url