<?php

function is_pjax(){
	if( isset( $_SERVER['HTTP_X_PJAX'] ) && strtolower( $_SERVER['HTTP_X_PJAX'] ) == 'true' ) {
		return true;
	}
	return false;
}